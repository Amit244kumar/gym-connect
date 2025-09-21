import express from 'express';
import { User } from '../models/User.js';
import { Gym } from '../models/Gym.js';
import { protect, authorize } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get gym overview statistics
// @route   GET /api/v1/analytics/overview
// @access  Private (Owner)
router.get('/overview', protect, authorize('owner'), async (req, res) => {
  try {
    const gym = await Gym.findOne({ owner: req.user._id });
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        error: 'Gym not found',
      });
    }

    // Get member statistics
    const memberStats = await User.aggregate([
      { $match: { gymId: gym._id, role: 'member' } },
      {
        $group: {
          _id: null,
          totalMembers: { $sum: 1 },
          activeMembers: { $sum: { $cond: [{ $eq: ['$membershipStatus', 'active'] }, 1, 0] } },
          pendingMembers: { $sum: { $cond: [{ $eq: ['$membershipStatus', 'pending'] }, 1, 0] } },
          expiredMembers: { $sum: { $cond: [{ $eq: ['$membershipStatus', 'expired'] }, 1, 0] } },
          newThisMonth: { $sum: { $cond: [{ $gte: ['$createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] }, 1, 0] } },
        },
      },
    ]);

    // Get activity statistics
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activityStats = await User.aggregate([
      { $match: { gymId: gym._id, role: 'member' } },
      {
        $group: {
          _id: null,
          activeToday: { $sum: { $cond: [{ $gte: ['$lastActive', today] }, 1, 0] } },
          activeThisWeek: { $sum: { $cond: [{ $gte: ['$lastActive', thisWeek] }, 1, 0] } },
          activeThisMonth: { $sum: { $cond: [{ $gte: ['$lastActive', thisMonth] }, 1, 0] } },
        },
      },
    ]);

    // Get gender distribution
    const genderStats = await User.aggregate([
      { $match: { gymId: gym._id, role: 'member' } },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get age distribution
    const ageStats = await User.aggregate([
      { $match: { gymId: gym._id, role: 'member', dateOfBirth: { $exists: true } } },
      {
        $addFields: {
          age: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), '$dateOfBirth'] },
                365 * 24 * 60 * 60 * 1000,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$age', 18] }, then: 'Under 18' },
                { case: { $lt: ['$age', 25] }, then: '18-24' },
                { case: { $lt: ['$age', 35] }, then: '25-34' },
                { case: { $lt: ['$age', 45] }, then: '35-44' },
                { case: { $lt: ['$age', 55] }, then: '45-54' },
                { case: { $lt: ['$age', 65] }, then: '55-64' },
              ],
              default: '65+',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = {
      gym: {
        id: gym._id,
        name: gym.name,
        businessType: gym.businessType,
        capacity: gym.capacity,
        currentMembers: gym.currentMembers,
        occupancyRate: gym.occupancyRate,
      },
      members: memberStats[0] || {
        totalMembers: 0,
        activeMembers: 0,
        pendingMembers: 0,
        expiredMembers: 0,
        newThisMonth: 0,
      },
      activity: activityStats[0] || {
        activeToday: 0,
        activeThisWeek: 0,
        activeThisMonth: 0,
      },
      demographics: {
        gender: genderStats,
        age: ageStats,
      },
    };

    res.json({
      success: true,
      data: { analytics: result },
    });
  } catch (error) {
    logger.error('Get analytics overview error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching analytics',
    });
  }
});

// @desc    Get member growth trends
// @route   GET /api/v1/analytics/growth
// @access  Private (Owner)
router.get('/growth', protect, authorize('owner'), async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const gym = await Gym.findOne({ owner: req.user._id });
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        error: 'Gym not found',
      });
    }

    const growthData = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const memberCount = await User.countDocuments({
        gymId: gym._id,
        role: 'member',
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const activeMembers = await User.countDocuments({
        gymId: gym._id,
        role: 'member',
        membershipStatus: 'active',
        $or: [
          { createdAt: { $lte: endDate } },
          { lastActive: { $gte: startDate, $lte: endDate } },
        ],
      });

      growthData.push({
        month: startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        newMembers: memberCount,
        activeMembers,
        period: { start: startDate, end: endDate },
      });
    }

    res.json({
      success: true,
      data: { growth: growthData },
    });
  } catch (error) {
    logger.error('Get growth analytics error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching growth data',
    });
  }
});

// @desc    Get peak hours analysis
// @route   GET /api/v1/analytics/peak-hours
// @access  Private (Owner)
router.get('/peak-hours', protect, authorize('owner'), async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const gym = await Gym.findOne({ owner: req.user._id });
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        error: 'Gym not found',
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get member activity by hour
    const hourlyActivity = await User.aggregate([
      { $match: { gymId: gym._id, role: 'member', lastActive: { $gte: startDate } } },
      {
        $addFields: {
          hour: { $hour: '$lastActive' },
        },
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get daily activity
    const dailyActivity = await User.aggregate([
      { $match: { gymId: gym._id, role: 'member', lastActive: { $gte: startDate } } },
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: '$lastActive' },
        },
      },
      {
        $group: {
          _id: '$dayOfWeek',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Convert to readable format
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formattedDailyActivity = dailyActivity.map(item => ({
      day: dayNames[item._id - 1],
      count: item.count,
    }));

    const formattedHourlyActivity = hourlyActivity.map(item => ({
      hour: item._id,
      time: `${item._id.toString().padStart(2, '0')}:00`,
      count: item.count,
    }));

    res.json({
      success: true,
      data: {
        peakHours: {
          hourly: formattedHourlyActivity,
          daily: formattedDailyActivity,
          period: { days, startDate, endDate: new Date() },
        },
      },
    });
  } catch (error) {
    logger.error('Get peak hours analytics error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching peak hours data',
    });
  }
});

// @desc    Get membership retention analysis
// @route   GET /api/v1/analytics/retention
// @access  Private (Owner)
router.get('/retention', protect, authorize('owner'), async (req, res) => {
  try {
    const gym = await Gym.findOne({ owner: req.user._id });
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        error: 'Gym not found',
      });
    }

    // Get membership status distribution
    const statusDistribution = await User.aggregate([
      { $match: { gymId: gym._id, role: 'member' } },
      {
        $group: {
          _id: '$membershipStatus',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Calculate retention rate
    const totalMembers = statusDistribution.reduce((sum, item) => sum + item.count, 0);
    const activeMembers = statusDistribution.find(item => item._id === 'active')?.count || 0;
    const retentionRate = totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0;

    // Get recent cancellations
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCancellations = await User.find({
      gymId: gym._id,
      role: 'member',
      membershipStatus: 'cancelled',
      updatedAt: { $gte: thirtyDaysAgo },
    })
      .select('firstName lastName email updatedAt')
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        retention: {
          statusDistribution,
          retentionRate: Math.round(retentionRate * 100) / 100,
          totalMembers,
          activeMembers,
          recentCancellations,
        },
      },
    });
  } catch (error) {
    logger.error('Get retention analytics error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching retention data',
    });
  }
});

export default router;
