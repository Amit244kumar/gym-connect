import jwt from 'jsonwebtoken';
import GymOwner from '../models/gymOwner.js';
import { logger } from '../utils/logger.js';

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get gym owner from token
      const owner = await GymOwner.findByPk(decoded.id);
      console.log("Owner from token:",owner);
      if (!owner) {
        return res.status(401).json({
          success: false,
          error: 'Gym owner not found',
        });
      }
      req.user = owner;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route, no token',
    });
  }
};

// export const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         error: 'User not authenticated',
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         error: `User role ${req.user.role} is not authorized to access this route`,
//       });
//     }

//     next();
//   };
// };

// export const optionalAuth = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id).select('-password');
      
//       if (user && user.isActive) {
//         req.user = user;
//       }
//     } catch (error) {
//       // Token is invalid, but we continue without authentication
//       logger.debug('Optional auth failed:', error.message);
//     }
//   }

//   next();
// };
export default authMiddleware;