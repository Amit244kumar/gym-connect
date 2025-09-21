import express from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get gym members
// @route   GET /api/v1/members
// @access  Private (Owner)
router.get('/', protect, authorize('owner'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      gymId: req.user.gymId,
      role: 'member',
    };

    // Additional filters
    if (req.query.membershipStatus) filter.membershipStatus = req.query.membershipStatus;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const members = await User.find(filter)
      .select('-password')
      .populate('membership', 'planType startDate endDate status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        members,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get members error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching members',
    });
  }
});

// @desc    Add member to gym
// @route   POST /api/v1/members
// @access  Private (Owner)
router.post('/', protect, authorize('owner'), [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[0-9+\-\s()]+$/).withMessage('Please provide a valid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
  body('address').optional().isObject().withMessage('Address must be an object'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { firstName, lastName, email, phone, dateOfBirth, gender, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or phone number already exists',
      });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    // Create member
    const member = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: tempPassword,
      role: 'member',
      gymId: req.user.gymId,
      dateOfBirth,
      gender,
      address,
      membershipStatus: 'pending',
    });

    // Remove password from response
    member.password = undefined;

    logger.info(`New member added: ${member.email} to gym: ${req.user.gymId}`);

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: {
        member,
        tempPassword,
        note: 'Temporary password generated. Member should change it on first login.',
      },
    });
  } catch (error) {
    logger.error('Add member error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while adding member',
    });
  }
});

// @desc    Get member details
// @route   GET /api/v1/members/:id
// @access  Private (Owner, Member)
router.get('/:id', protect, async (req, res) => {
  try {
    const member = await User.findById(req.params.id)
      .select('-password')
      .populate('gymId', 'name businessType address')
      .populate('membership', 'planType startDate endDate status');

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found',
      });
    }

    // Check authorization
    if (req.user.role === 'member' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this member',
      });
    }

    if (req.user.role === 'owner' && member.gymId?.toString() !== req.user.gymId?.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this member',
      });
    }

    res.json({
      success: true,
      data: { member },
    });
  } catch (error) {
    logger.error('Get member error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching member',
    });
  }
});

// @desc    Update member
// @route   PUT /api/v1/members/:id
// @access  Private (Owner, Member)
router.put('/:id', protect, [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().matches(/^[0-9+\-\s()]+$/),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']),
  body('address').optional().isObject(),
  body('membershipStatus').optional().isIn(['active', 'expired', 'pending', 'cancelled']),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found',
      });
    }

    // Check authorization
    if (req.user.role === 'member' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this member',
      });
    }

    if (req.user.role === 'owner' && member.gymId?.toString() !== req.user.gymId?.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this member',
      });
    }

    // Update member
    const updatedMember = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    logger.info(`Member updated: ${updatedMember.email}`);

    res.json({
      success: true,
      message: 'Member updated successfully',
      data: { member: updatedMember },
    });
  } catch (error) {
    logger.error('Update member error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while updating member',
    });
  }
});

// @desc    Remove member from gym
// @route   DELETE /api/v1/members/:id
// @access  Private (Owner)
router.delete('/:id', protect, authorize('owner'), async (req, res) => {
  try {
    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found',
      });
    }

    // Check if member belongs to this gym
    if (member.gymId?.toString() !== req.user.gymId?.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to remove this member',
      });
    }

    // Soft delete - set isActive to false
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false,
      gymId: null,
      membershipStatus: 'cancelled',
    });

    logger.info(`Member removed from gym: ${member.email}`);

    res.json({
      success: true,
      message: 'Member removed from gym successfully',
    });
  } catch (error) {
    logger.error('Remove member error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while removing member',
    });
  }
});

// @desc    Get member statistics
// @route   GET /api/v1/members/stats/overview
// @access  Private (Owner)
router.get('/stats/overview', protect, authorize('owner'), async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { gymId: req.user.gymId, role: 'member' } },
      {
        $group: {
          _id: null,
          totalMembers: { $sum: 1 },
          activeMembers: { $sum: { $cond: [{ $eq: ['$membershipStatus', 'active'] }, 1, 0] } },
          pendingMembers: { $sum: { $cond: [{ $eq: ['$membershipStatus', 'pending'] }, 1, 0] } },
          expiredMembers: { $sum: { $cond: [{ $eq: ['$membershipStatus', 'expired'] }, 1, 0] } },
          cancelledMembers: { $sum: { $cond: [{ $eq: ['$membershipStatus', 'cancelled'] }, 1, 0] } },
          activeToday: { $sum: { $cond: [{ $gte: ['$lastActive', new Date(Date.now() - 24 * 60 * 60 * 1000)] }, 1, 0] } },
          activeThisWeek: { $sum: { $cond: [{ $gte: ['$lastActive', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] }, 1, 0] } },
        },
      },
    ]);

    const result = stats[0] || {
      totalMembers: 0,
      activeMembers: 0,
      pendingMembers: 0,
      expiredMembers: 0,
      cancelledMembers: 0,
      activeToday: 0,
      activeThisWeek: 0,
    };

    res.json({
      success: true,
      data: { statistics: result },
    });
  } catch (error) {
    logger.error('Get member statistics error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics',
    });
  }
});

export default router;
