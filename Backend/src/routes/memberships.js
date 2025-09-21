import express from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get all memberships
// @route   GET /api/v1/memberships
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
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const memberships = await User.find(filter)
      .select('-password')
      .populate('membership', 'planType startDate endDate status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        memberships,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get memberships error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching memberships',
    });
  }
});

// @desc    Update membership status
// @route   PUT /api/v1/memberships/:id/status
// @access  Private (Owner)
router.put('/:id/status', protect, authorize('owner'), [
  body('membershipStatus').isIn(['active', 'expired', 'pending', 'cancelled']).withMessage('Invalid membership status'),
  body('startDate').optional().isISO8601().withMessage('Invalid start date'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
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

    const { membershipStatus, startDate, endDate, notes } = req.body;

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
        error: 'Not authorized to update this membership',
      });
    }

    // Update membership
    const updateData = { membershipStatus };
    if (startDate) updateData.membershipStartDate = startDate;
    if (endDate) updateData.membershipEndDate = endDate;
    if (notes) updateData.membershipNotes = notes;

    const updatedMember = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    logger.info(`Membership status updated: ${updatedMember.email} to ${membershipStatus}`);

    res.json({
      success: true,
      message: 'Membership status updated successfully',
      data: { member: updatedMember },
    });
  } catch (error) {
    logger.error('Update membership status error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while updating membership status',
    });
  }
});

// @desc    Get expiring memberships
// @route   GET /api/v1/memberships/expiring
// @access  Private (Owner)
router.get('/expiring', protect, authorize('owner'), async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const date = new Date();
    date.setDate(date.getDate() + days);

    const expiringMemberships = await User.find({
      gymId: req.user.gymId,
      role: 'member',
      membershipStatus: 'active',
      membershipEndDate: { $lte: date },
    })
      .select('-password')
      .populate('membership', 'planType startDate endDate status')
      .sort({ membershipEndDate: 1 });

    res.json({
      success: true,
      data: {
        expiringMemberships,
        count: expiringMemberships.length,
        daysAhead: days,
      },
    });
  } catch (error) {
    logger.error('Get expiring memberships error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching expiring memberships',
    });
  }
});

// @desc    Renew membership
// @route   POST /api/v1/memberships/:id/renew
// @access  Private (Owner)
router.post('/:id/renew', protect, authorize('owner'), [
  body('planType').isIn(['monthly', 'quarterly', 'yearly']).withMessage('Invalid plan type'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1'),
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

    const { planType, duration } = req.body;

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
        error: 'Not authorized to renew this membership',
      });
    }

    // Calculate new dates
    const startDate = new Date();
    const endDate = new Date();
    
    switch (planType) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + duration);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + (duration * 3));
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + duration);
        break;
    }

    // Update membership
    const updatedMember = await User.findByIdAndUpdate(
      req.params.id,
      {
        membershipStatus: 'active',
        membershipStartDate: startDate,
        membershipEndDate: endDate,
        membershipPlanType: planType,
      },
      { new: true }
    ).select('-password');

    logger.info(`Membership renewed: ${updatedMember.email} for ${planType} plan`);

    res.json({
      success: true,
      message: 'Membership renewed successfully',
      data: {
        member: updatedMember,
        newStartDate: startDate,
        newEndDate: endDate,
        planType,
      },
    });
  } catch (error) {
    logger.error('Renew membership error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while renewing membership',
    });
  }
});

export default router;
