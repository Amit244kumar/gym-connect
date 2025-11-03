import { body, param, query } from 'express-validator';

// Gym Owner Registration Validation
const validateGymOwnerRegistration = [
  body('ownerName')
    .trim()
    .notEmpty()
    .withMessage('Owner name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Owner name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Owner name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 150 })
    .withMessage('Email cannot exceed 150 characters'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]{10,15}$/)
    .withMessage('Please enter a valid phone number (10-15 digits)')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('gymName')
    .trim()
    .notEmpty()
    .withMessage('Gym name is required')
    .isLength({ min: 2, max: 120 })
    .withMessage('Gym name must be between 2 and 120 characters')
    .matches(/^[a-zA-Z0-9\s\-&.()]+$/)
    .withMessage('Gym name can only contain letters, numbers, spaces, hyphens, ampersands, dots, and parentheses'),

  // body('ownerPhoto')
  //   .optional()
  //   .isURL()
  //   .withMessage('Owner photo must be a valid URL')
  //   .isLength({ max: 500 })
  //   .withMessage('Owner photo URL cannot exceed 500 characters'),
];
const validateGymNameUnique = [
  body('gymName')
    .trim()
    .notEmpty()
    .withMessage('Gym name is required')
    .isLength({ min: 2, max: 120 })
    .withMessage('Gym name must be between 2 and 120 characters')
    .matches(/^[a-zA-Z0-9\s\-&.()]+$/)
    .withMessage('Gym name can only contain letters, numbers, spaces, hyphens, ampersands, dots, and parentheses'),
];
// Gym Owner Login Validation
const validateGymOwnerLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];

// Gym Owner Profile Update Validation
const validateGymOwnerProfileUpdate = [
  body('ownerName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Owner name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Owner name can only contain letters and spaces'),

  body('gymName')
    .trim()
    .notEmpty()
    .withMessage('Gym name is required')
    .isLength({ min: 2, max: 120 })
    .withMessage('Gym name must be between 2 and 120 characters')
    .matches(/^[a-zA-Z0-9\s\-&.()]+$/)
    .withMessage('Gym name can only contain letters, numbers, spaces, hyphens, ampersands, dots, and parentheses'),

  body('profileImage')
    .optional()
    .isURL()
    .withMessage('Owner photo must be a valid URL')
    .isLength({ max: 500 })
    .withMessage('Owner photo URL cannot exceed 500 characters'),
];

// // Change Password Validation
// const validateChangePassword = [
//   body('currentPassword')
//     .trim()
//     .notEmpty()
//     .withMessage('Current password is required'),

//   body('newPassword')
//     .trim()
//     .notEmpty()
//     .withMessage('New password is required')
//     .isLength({ min: 8, max: 128 })
//     .withMessage('New password must be between 8 and 128 characters')
//     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
//     .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
// ];

// Gym Owner ID Parameter Validation
const validateGymOwnerId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Gym owner ID must be a positive integer'),
];

// Gym Owner Search/Filter Validation
const validateGymOwnerSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page number must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'trial', 'premium', 'expired'])
    .withMessage('Status must be one of: active, inactive, trial, premium, expired'),
];

// Email Verification Validation
const validateEmailVerification = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Verification token is required')
    .isLength({ min: 32, max: 255 })
    .withMessage('Verification token must be between 32 and 255 characters'),
];

// Phone Verification Validation
const validatePhoneVerification = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]{10,15}$/)
    .withMessage('Please enter a valid phone number (10-15 digits)'),

  body('code')
    .trim()
    .notEmpty()
    .withMessage('Verification code is required')
    .isLength({ min: 4, max: 10 })
    .withMessage('Verification code must be between 4 and 10 characters')
    .isNumeric()
    .withMessage('Verification code must contain only numbers'),
];

// Resend Verification Code Validation
const validateResendVerificationCode = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]{10,15}$/)
    .withMessage('Please enter a valid phone number (10-15 digits)'),
];


// Forgot Password Validation
const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
];

// Reset Password Validation
const validateResetPassword = [
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Subscription Plan Validation
const validateSubscriptionPlan = [
  body('planType')
    .trim()
    .notEmpty()
    .withMessage('Plan type is required')
    .isIn(['trial', 'premium'])
    .withMessage('Plan type must be either trial or premium'),

  body('planId')
    .optional()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('Plan ID cannot exceed 120 characters'),
];

// Settings Update Validation
const validateSettingsUpdate = [
  body('qrCodeEnabled')
    .optional()
    .isBoolean()
    .withMessage('QR code enabled must be a boolean value'),

  body('autoRenewal')
    .optional()
    .isBoolean()
    .withMessage('Auto renewal must be a boolean value'),

  body('notificationsEmail')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean value'),

  body('notificationsSms')
    .optional()
    .isBoolean()
    .withMessage('SMS notifications must be a boolean value'),

  body('notificationsPush')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean value'),
];

// all validations
export {
  validateGymOwnerRegistration,
  validateGymNameUnique,
  validateGymOwnerLogin,
  validateGymOwnerProfileUpdate,
  // validateChangePassword,
  validateGymOwnerId,
  validateGymOwnerSearch,
  validateEmailVerification,
  validatePhoneVerification,
  validateResendVerificationCode,
  validateForgotPassword,
  validateResetPassword,
  validateSubscriptionPlan,
  validateSettingsUpdate,
};
