import express from 'express';
import { body, validationResult } from 'express-validator';
import QRCode from 'qrcode';
import { User } from '../models/User.js';
import { Gym } from '../models/Gym.js';
import { protect, authorize } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Generate QR code for gym entry
// @route   POST /api/v1/qr/generate
// @access  Private (Gym Owner)
router.post('/generate', protect, authorize('owner'), [
  body('gymId').isMongoId().withMessage('Valid gym ID is required'),
  body('memberId').isMongoId().withMessage('Valid member ID is required'),
  body('expiresIn').optional().isInt({ min: 1, max: 1440 }).withMessage('Expires in must be between 1 and 1440 minutes'),
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

    const { gymId, memberId, expiresIn = 60 } = req.body;

    // Verify gym ownership
    const gym = await Gym.findOne({ _id: gymId, owner: req.user._id });
    if (!gym) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to generate QR codes for this gym',
      });
    }

    // Verify member belongs to this gym
    const member = await User.findOne({ _id: memberId, gymId, role: 'member' });
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found or does not belong to this gym',
      });
    }

    // Check if member has active membership
    if (member.membershipStatus !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Member does not have an active membership',
      });
    }

    // Generate QR code data
    const qrData = {
      gymId: gym._id.toString(),
      memberId: member._id.toString(),
      timestamp: Date.now(),
      expiresAt: Date.now() + (expiresIn * 60 * 1000), // Convert minutes to milliseconds
      type: 'gym_entry',
    };

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    logger.info(`QR code generated for member: ${member.email} at gym: ${gym.name}`);

    res.json({
      success: true,
      message: 'QR code generated successfully',
      data: {
        qrCode: qrCodeDataURL,
        expiresAt: new Date(qrData.expiresAt),
        member: {
          id: member._id,
          name: member.fullName,
          membershipStatus: member.membershipStatus,
        },
        gym: {
          id: gym._id,
          name: gym.name,
        },
      },
    });
  } catch (error) {
    logger.error('QR code generation error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error during QR code generation',
    });
  }
});

// @desc    Scan QR code for gym entry
// @route   POST /api/v1/qr/scan
// @access  Public
router.post('/scan', [
  body('qrData').notEmpty().withMessage('QR code data is required'),
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

    const { qrData } = req.body;

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid QR code data format',
      });
    }

    // Validate QR code data structure
    if (!parsedData.gymId || !parsedData.memberId || !parsedData.expiresAt || !parsedData.type) {
      return res.status(400).json({
        success: false,
        error: 'Invalid QR code data structure',
      });
    }

    // Check if QR code is expired
    if (Date.now() > parsedData.expiresAt) {
      return res.status(400).json({
        success: false,
        error: 'QR code has expired',
      });
    }

    // Check if QR code is for gym entry
    if (parsedData.type !== 'gym_entry') {
      return res.status(400).json({
        success: false,
        error: 'Invalid QR code type',
      });
    }

    // Verify gym exists and is active
    const gym = await Gym.findById(parsedData.gymId);
    if (!gym || !gym.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Gym not found or inactive',
      });
    }

    // Check if gym is open
    if (!gym.isOpen()) {
      return res.status(400).json({
        success: false,
        error: 'Gym is currently closed',
      });
    }

    // Verify member exists and belongs to this gym
    const member = await User.findById(parsedData.memberId);
    if (!member || member.gymId.toString() !== parsedData.gymId || member.role !== 'member') {
      return res.status(400).json({
        success: false,
        error: 'Member not found or does not belong to this gym',
      });
    }

    // Check if member has active membership
    if (member.membershipStatus !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Member does not have an active membership',
      });
    }

    // Check if member is blocked
    if (member.isBlocked || !member.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Member account is blocked or inactive',
      });
    }

    // Update member's last active time
    member.lastActive = new Date();
    await member.save();

    // Log the check-in
    logger.info(`Member check-in: ${member.email} at gym: ${gym.name}`);

    res.json({
      success: true,
      message: 'Entry successful',
      data: {
        member: {
          id: member._id,
          name: member.fullName,
          membershipStatus: member.membershipStatus,
        },
        gym: {
          id: gym._id,
          name: gym.name,
        },
        checkInTime: new Date(),
        qrCodeId: parsedData.timestamp,
      },
    });
  } catch (error) {
    logger.error('QR code scan error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error during QR code scan',
    });
  }
});

// @desc    Generate bulk QR codes for gym members
// @route   POST /api/v1/qr/bulk-generate
// @access  Private (Gym Owner)
router.post('/bulk-generate', protect, authorize('owner'), [
  body('gymId').isMongoId().withMessage('Valid gym ID is required'),
  body('memberIds').isArray({ min: 1 }).withMessage('At least one member ID is required'),
  body('memberIds.*').isMongoId().withMessage('All member IDs must be valid'),
  body('expiresIn').optional().isInt({ min: 1, max: 1440 }).withMessage('Expires in must be between 1 and 1440 minutes'),
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

    const { gymId, memberIds, expiresIn = 60 } = req.body;

    // Verify gym ownership
    const gym = await Gym.findOne({ _id: gymId, owner: req.user._id });
    if (!gym) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to generate QR codes for this gym',
      });
    }

    // Get all members
    const members = await User.find({
      _id: { $in: memberIds },
      gymId,
      role: 'member',
      membershipStatus: 'active',
      isActive: true,
      isBlocked: false,
    });

    if (members.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No valid members found',
      });
    }

    // Generate QR codes for each member
    const qrCodes = [];
    for (const member of members) {
      const qrData = {
        gymId: gym._id.toString(),
        memberId: member._id.toString(),
        timestamp: Date.now() + Math.random(), // Ensure unique timestamp
        expiresAt: Date.now() + (expiresIn * 60 * 1000),
        type: 'gym_entry',
      };

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      qrCodes.push({
        member: {
          id: member._id,
          name: member.fullName,
          email: member.email,
        },
        qrCode: qrCodeDataURL,
        expiresAt: new Date(qrData.expiresAt),
      });
    }

    logger.info(`Bulk QR codes generated for ${qrCodes.length} members at gym: ${gym.name}`);

    res.json({
      success: true,
      message: `QR codes generated successfully for ${qrCodes.length} members`,
      data: {
        qrCodes,
        gym: {
          id: gym._id,
          name: gym.name,
        },
        totalGenerated: qrCodes.length,
      },
    });
  } catch (error) {
    logger.error('Bulk QR code generation error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error during bulk QR code generation',
    });
  }
});

// @desc    Get QR code statistics for a gym
// @route   GET /api/v1/qr/stats/:gymId
// @access  Private (Gym Owner)
router.get('/stats/:gymId', protect, authorize('owner'), async (req, res) => {
  try {
    const { gymId } = req.params;

    // Verify gym ownership
    const gym = await Gym.findOne({ _id: gymId, owner: req.user._id });
    if (!gym) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to view statistics for this gym',
      });
    }

    // Get member count
    const totalMembers = await User.countDocuments({
      gymId,
      role: 'member',
      membershipStatus: 'active',
    });

    // Get active members (logged in within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeMembers = await User.countDocuments({
      gymId,
      role: 'member',
      membershipStatus: 'active',
      lastActive: { $gte: thirtyDaysAgo },
    });

    // Get recent check-ins (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCheckIns = await User.countDocuments({
      gymId,
      role: 'member',
      membershipStatus: 'active',
      lastActive: { $gte: sevenDaysAgo },
    });

    res.json({
      success: true,
      data: {
        gym: {
          id: gym._id,
          name: gym.name,
        },
        statistics: {
          totalMembers,
          activeMembers,
          recentCheckIns,
          activityRate: totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0,
        },
      },
    });
  } catch (error) {
    logger.error('QR statistics error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics',
    });
  }
});

export default router;
