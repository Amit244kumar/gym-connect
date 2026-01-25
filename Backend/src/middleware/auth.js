import jwt from 'jsonwebtoken';
import GymOwner from '../models/gymOwner.js';
import Member from '../models/member.js';

const ownerAuthMiddleware = async (req, res, next) => {
  let token;
  console.log("Headers:", req.headers);
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
export const memberAuthMiddleware = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get member from token
      const member = await Member.findByPk(decoded.id);
      if (!member) {
        return res.status(401).json({
          success: false,
          error: 'Member not found',
        });
      }
      req.user = member;
      next();
    }
    catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }
  }
}

export default ownerAuthMiddleware;