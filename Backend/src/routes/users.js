import express from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get all users (with pagination and filtering)
// @route   GET /api/v1/users
// @access  Private (Admin, Owner)
router.get('/', protect, authorize('admin', 'owner'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    
    // Role-based filtering
    if (req.user.role === 'owner') {
      filter.gymId = req.user.gymId;
    }
    
    // Additional filters
    if (req.query.role) filter.role = req.query.role;
    if (req.query.membershipStatus) filter.membershipStatus = req.query.membershipStatus;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('gymId', 'name')
      .populate('membership', 'planType startDate endDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get users error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users',
    });
  }
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('gymId', 'name businessType address')
      .populate('membership', 'planType startDate endDate status');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check authorization
    if (req.user.role === 'member' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this user',
      });
    }

    if (req.user.role === 'owner' && user.gymId?.toString() !== req.user.gymId?.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this user',
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error('Get user error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching user',
    });
  }
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private
router.put('/:id', protect, [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().matches(/^[0-9+\-\s()]+$/),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']),
  body('address').optional().isObject(),
  body('preferences').optional().isObject(),
  body('isActive').optional().isBoolean(),
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

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check authorization
    if (req.user.role === 'member' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this user',
      });
    }

    if (req.user.role === 'owner' && user.gymId?.toString() !== req.user.gymId?.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this user',
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    logger.info(`User updated: ${updatedUser.email} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser },
    });
  } catch (error) {
    logger.error('Update user error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while updating user',
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin, Owner)
router.delete('/:id', protect, authorize('admin', 'owner'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check authorization for owners
    if (req.user.role === 'owner' && user.gymId?.toString() !== req.user.gymId?.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this user',
      });
    }

    // Soft delete - set isActive to false
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false,
      isBlocked: true,
    });

    logger.info(`User deactivated: ${user.email} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    logger.error('Delete user error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting user',
    });
  }
});

// @desc    Block/Unblock user
// @route   PATCH /api/v1/users/:id/block
// @access  Private (Admin, Owner)
router.patch('/:id/block', protect, authorize('admin', 'owner'), [
  body('isBlocked').isBoolean().withMessage('isBlocked must be a boolean'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
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

    const { isBlocked, reason } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check authorization for owners
    if (req.user.role === 'owner' && user.gymId?.toString() !== req.user.gymId?.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this user',
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked,
        ...(reason && { blockReason: reason }),
      },
      { new: true }
    ).select('-password');

    const action = isBlocked ? 'blocked' : 'unblocked';
    logger.info(`User ${action}: ${updatedUser.email} by ${req.user.email}`);

    res.json({
      success: true,
      message: `User ${action} successfully`,
      data: { user: updatedUser },
    });
  } catch (error) {
    logger.error('Block user error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while blocking/unblocking user',
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/v1/users/stats/overview
// @access  Private (Admin, Owner)
router.get('/stats/overview', protect, authorize('admin', 'owner'), async (req, res) => {
  try {
    const filter = {};
    
    // Role-based filtering
    if (req.user.role === 'owner') {
      filter.gymId = req.user.gymId;
    }

    const stats = await User.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          blockedUsers: { $sum: { $cond: [{ $eq: ['$isBlocked', true] }, 1, 0] } },
          members: { $sum: { $cond: [{ $eq: ['$role', 'member'] }, 1, 0] } },
          owners: { $sum: { $cond: [{ $eq: ['$role', 'owner'] }, 1, 0] } },
          activeMembers: { $sum: { $cond: [{ $and: [{ $eq: ['$role', 'member'] }, { $eq: ['$membershipStatus', 'active'] }] }, 1, 0] } },
        },
      },
    ]);

    const result = stats[0] || {
      totalUsers: 0,
      activeUsers: 0,
      blockedUsers: 0,
      members: 0,
      owners: 0,
      activeMembers: 0,
    };

    res.json({
      success: true,
      data: { statistics: result },
    });
  } catch (error) {
    logger.error('Get user statistics error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics',
    });
  }
});

export default router;
