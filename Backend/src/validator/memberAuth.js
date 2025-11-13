import { body, param, query } from 'express-validator';
const ValidationMemberRegister = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('plan').isNumeric(),
  body('startDate').isISO8601().withMessage('Invalid date format for start date'),
  body('profileImage').optional().custom((value, { req }) => {
    if (!value) return true; // If no file is provided, skip validation
    
    // Check if file size is less than 5MB
    if (value.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }
    
    // Check if file type is valid
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(value.mimetype)) {
      throw new Error('Only JPG, PNG, or GIF images are allowed');
    }
    
    return true;
  })
];
const validateMemberLogin = [
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
export { ValidationMemberRegister,validateMemberLogin };