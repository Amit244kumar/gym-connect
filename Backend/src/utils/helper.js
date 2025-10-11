import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate JWT token
export const generateToken = (owner) => {
  return jwt.sign(
    { 
      id: owner.id, 
      email: owner.email, 
      gymName: owner.gymName,
      role: 'gym_owner' 
    },
    process.env.JWT_SECRET 
  );
};

// Generate email verification token
export const generateEmailVerificationToken = () => {
  return crypto.randomBytes(6).toString('base64url').substring(0, 6);
};

// Generate phone verification OTP
export const generatePhoneVerificationOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};

// Generate random string for various purposes
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate secure random number
export const generateSecureRandom = (min = 100000, max = 999999) => {
  return Math.floor(crypto.randomInt(min, max + 1));
};

// Hash sensitive data (for non-password data)
export const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Generate UUID-like string
export const generateUUID = () => {
  return crypto.randomUUID();
};

