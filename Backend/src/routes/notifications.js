import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // In a real implementation, you would fetch from a Notification model
    // For now, we'll return mock data based on user role
    let mockNotifications = [];

    if (req.user.role === 'owner') {
      mockNotifications = [
        {
          id: '1',
          type: 'membership_expiry',
          title: 'Membership Expiring Soon',
          message: '5 members have memberships expiring in the next 7 days',
          priority: 'high',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          actionUrl: '/members/expiring',
        },
        {
          id: '2',
          type: 'new_member',
          title: 'New Member Registration',
          message: 'John Doe has registered as a new member',
          priority: 'medium',
          isRead: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          actionUrl: '/members/new',
        },
        {
          id: '3',
          type: 'system',
          title: 'System Update',
          message: 'New features have been added to your dashboard',
          priority: 'low',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          actionUrl: '/dashboard',
        },
      ];
    } else {
      mockNotifications = [
        {
          id: '1',
          type: 'membership_reminder',
          title: 'Membership Renewal Reminder',
          message: 'Your membership expires in 15 days. Renew now to avoid interruption.',
          priority: 'high',
          isRead: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          actionUrl: '/membership/renew',
        },
        {
          id: '2',
          type: 'gym_update',
          title: 'Gym Schedule Update',
          message: 'New fitness classes have been added to the schedule',
          priority: 'medium',
          isRead: false,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          actionUrl: '/schedule',
        },
      ];
    }

    const total = mockNotifications.length;
    const notifications = mockNotifications.slice(skip, skip + limit);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        unreadCount: mockNotifications.filter(n => !n.isRead).length,
      },
    });
  } catch (error) {
    logger.error('Get notifications error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching notifications',
    });
  }
});

// @desc    Mark notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // In a real implementation, you would update the notification in the database
    // For now, we'll simulate the update
    logger.info(`Notification marked as read: ${id} by user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { notificationId: id },
    });
  } catch (error) {
    logger.error('Mark notification as read error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while updating notification',
    });
  }
});

// @desc    Mark all notifications as read
// @route   PATCH /api/v1/notifications/read-all
// @access  Private
router.patch('/read-all', protect, async (req, res) => {
  try {
    // In a real implementation, you would update all notifications for the user
    logger.info(`All notifications marked as read by user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    logger.error('Mark all notifications as read error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while updating notifications',
    });
  }
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // In a real implementation, you would delete the notification from the database
    logger.info(`Notification deleted: ${id} by user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Notification deleted successfully',
      data: { notificationId: id },
    });
  } catch (error) {
    logger.error('Delete notification error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting notification',
    });
  }
});

// @desc    Send notification to members
// @route   POST /api/v1/notifications/send
// @access  Private (Owner)
router.post('/send', protect, authorize('owner'), [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('message').trim().isLength({ min: 10, max: 500 }).withMessage('Message must be between 10 and 500 characters'),
  body('type').isIn(['announcement', 'reminder', 'update', 'event']).withMessage('Invalid notification type'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('memberIds').optional().isArray().withMessage('Member IDs must be an array'),
  body('sendToAll').optional().isBoolean().withMessage('Send to all must be a boolean'),
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

    const { title, message, type, priority = 'medium', memberIds, sendToAll = false } = req.body;

    // In a real implementation, you would:
    // 1. Create notifications in the database
    // 2. Send push notifications
    // 3. Send emails/SMS if configured
    // 4. Update member notification preferences

    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type,
      priority,
      sender: req.user._id,
      recipients: sendToAll ? 'all_members' : memberIds || [],
      status: 'sent',
      createdAt: new Date(),
    };

    logger.info(`Notification sent: ${title} by ${req.user.email} to ${sendToAll ? 'all members' : memberIds?.length || 0} members`);

    res.json({
      success: true,
      message: 'Notification sent successfully',
      data: { notification },
    });
  } catch (error) {
    logger.error('Send notification error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while sending notification',
    });
  }
});

// @desc    Get notification preferences
// @route   GET /api/v1/notifications/preferences
// @access  Private
router.get('/preferences', protect, async (req, res) => {
  try {
    // In a real implementation, you would fetch from user preferences
    const preferences = {
      email: {
        announcements: true,
        reminders: true,
        updates: false,
        events: true,
      },
      sms: {
        announcements: false,
        reminders: true,
        updates: false,
        events: false,
      },
      push: {
        announcements: true,
        reminders: true,
        updates: true,
        events: true,
      },
      frequency: 'immediate', // immediate, daily, weekly
    };

    res.json({
      success: true,
      data: { preferences },
    });
  } catch (error) {
    logger.error('Get notification preferences error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching preferences',
    });
  }
});

// @desc    Update notification preferences
// @route   PUT /api/v1/notifications/preferences
// @access  Private
router.put('/preferences', protect, [
  body('email').optional().isObject().withMessage('Email preferences must be an object'),
  body('sms').optional().isObject().withMessage('SMS preferences must be an object'),
  body('push').optional().isObject().withMessage('Push preferences must be an object'),
  body('frequency').optional().isIn(['immediate', 'daily', 'weekly']).withMessage('Invalid frequency'),
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

    // In a real implementation, you would update user preferences in the database
    logger.info(`Notification preferences updated by user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: { preferences: req.body },
    });
  } catch (error) {
    logger.error('Update notification preferences error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while updating preferences',
    });
  }
});

export default router;
