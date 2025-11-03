import express from 'express';
import {
  registerGymOwner,
  loginGymOwner,
  getProfile,
  updateProfile,
  logout,
  refreshToken,
  isGymNameUnique,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  verifyEmail,
  resendEmailVerification
} from '../controller/gymOwnerAuth.js';
import {uploadOwner} from '../helper/uploadImage.js';
import {
  validateGymOwnerRegistration,
  validateGymNameUnique,
  validateGymOwnerLogin,
  validateGymOwnerProfileUpdate,
  // validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  
} from '../validator/gymOwnerAuth.js';

import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public Routes (No Authentication Required)
// =========================================

// POST /api/gym-owner/register
// Register a new gym owner
router.post('/register',uploadOwner.single("profileImage"), validateGymOwnerRegistration, registerGymOwner);

router.get('/check-gym-name/:gymName', isGymNameUnique);
// POST /api/gym-owner/login
// Login gym owner
router.post('/login', validateGymOwnerLogin, loginGymOwner);


// GET /api/gym-owner/profile
// Get gym owner profile
router.get('/owner-profile', authMiddleware, getProfile);

// PUT /api/gym-owner/profile
// Update gym owner profile
router.put('/update-profile', 
  authMiddleware,
  uploadOwner.single("profileImage"), 
  validateGymOwnerProfileUpdate, 
  updateProfile
);

// POST /api/gym-owner/forgot-password
// Send password reset email
router.post('/forgot-password', validateForgotPassword, forgotPassword);

// get /api/gym-owner/forgot-password
// Verify password reset token
router.get("/verifyResetToken/:token",verifyResetToken);

// PUT /api/gym-owner/change-password
// Change gym owner password
// router.put('/reset-password/:token', validateResetPassword, resetPassword);


// POST /api/gym-owner/logout
// Logout gym owner
router.post('/logout', authMiddleware, logout);

// POST /api/gym-owner/refresh-token
// Refresh JWT token
router.post('/refresh-token', authMiddleware, refreshToken);



// POST /api/gym-owner/reset-password
// Reset password with token
router.put('/reset-password/:token', validateResetPassword, resetPassword);

router.post('/resend-Email-Verification',authMiddleware,resendEmailVerification);
// POST /api/gym-owner/verify-email
// Verify email address
router.post('/verify-email',authMiddleware,verifyEmail);

// POST /api/gym-owner/verify-phone
// Verify phone number
// router.post('/verify-phone', validatePhoneVerification, verifyPhone);

// POST /api/gym-owner/resend-verification
// Resend verification code
// router.post('/resend-verification', validateResendVerificationCode, resendVerificationCode);

// PUT /api/gym-owner/subscription
// Update subscription plan
// router.put('/subscription', authMiddleware, validateSubscriptionPlan, updateSubscription);

// PUT /api/gym-owner/settings
// Update gym owner settings
// router.put('/settings', authMiddleware, validateSettingsUpdate, updateSettings);

// GET /api/gym-owner/dashboard
// Get gym owner dashboard data
// router.get('/dashboard', authMiddleware, getDashboard);

// GET /api/gym-owner/members
// Get gym members list
// router.get('/members', authMiddleware, getMembers);

// GET /api/gym-owner/members/:id
// Get specific gym member details
// router.get('/members/:id', authMiddleware, validateGymOwnerId, getMember);

// POST /api/gym-owner/members/:id/renew
// Renew member membership
// router.post('/members/:id/renew', authMiddleware, validateGymOwnerId, renewMembership);

// DELETE /api/gym-owner/members/:id
// Delete gym member
// router.delete('/members/:id', authMiddleware, validateGymOwnerId, deleteMember);

// GET /api/gym-owner/checkins
// Get gym check-ins
// router.get('/checkins', authMiddleware, getCheckins);

// GET /api/gym-owner/checkins/today
// Get today's check-ins
// router.get('/checkins/today', authMiddleware, getTodayCheckins);

// GET /api/gym-owner/analytics
// Get gym analytics
// router.get('/analytics', authMiddleware, getAnalytics);

// GET /api/gym-owner/qr-code
// Get gym QR code
// router.get('/qr-code', authMiddleware, getQrCode);

// GET /api/gym-owner/registration-url
// Get gym registration URL
// router.get('/registration-url', authMiddleware, getRegistrationUrl);

// PUT /api/gym-owner/notifications
// Update notification preferences
// router.put('/notifications', authMiddleware, updateNotifications);



export default router ;
