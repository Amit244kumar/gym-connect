import {GymOwner, Member } from '../models/index.js';
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Make sure to import crypto
// import logger from "../utils/logger.js";
import { sendMemberWelcomeEmail } from '../helper/emailHelper.js';
import { Op } from 'sequelize';

const registerMember = async (req, res) => {
  try {
    // 1. Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { 
      name, 
      email, 
      phone, 
      address, 
      dateOfBirth,
      gender,
      plan, 
      startDate:membershipStartDate, 
    } = req.body;
    const ownerId=req.user.id
    console.log("req.body",name, 
      email, 
      phone, 
      address, 
      dateOfBirth,
      gender,
      plan, 
      membershipStartDate
      ,ownerId)
      const memberPhoto = req.file ? `member/${req.file.filename}` : null;
      console.log("memberPhoto",memberPhoto)
    // 2. Check if member already exists (email or phone)
    const existingUserWithEmail = await Member.findOne({
      where: { email }
    });
    
    if (existingUserWithEmail) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // const existingUserWithPhone = await Member.findOne({
    //   where: { phone }
    // });
    
    // if (existingUserWithPhone) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "User with this phone already exists",
    //   });
    // }

    // 3. Generate a temporary random password
    const tempPassword = crypto.randomBytes(10).toString('base64url').substring(0, 10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    console.log("dsafasads",tempPassword,hashedPassword)
    // 4. Calculate end date and expiry days based on plan
    let membershipEndDate = null;
    let expireInDays = 0;
    if (membershipStartDate && plan) {
      const startDate = new Date(membershipStartDate);
      
      // Calculate end date based on plan
      switch (plan) {
        case "basic":
          membershipEndDate = new Date(startDate);
          membershipEndDate.setMonth(startDate.getMonth() + 1);
          expireInDays = 30;
          break;
        case "standard":
          membershipEndDate = new Date(startDate);
          membershipEndDate.setMonth(startDate.getMonth() + 3);
          expireInDays = 90;
          break;
        case "premium":
          membershipEndDate = new Date(startDate);
          membershipEndDate.setMonth(startDate.getMonth() + 6);
          expireInDays = 180;
          break;
        case "annual":
          membershipEndDate = new Date(startDate);
          membershipEndDate.setFullYear(startDate.getFullYear() + 1);
          expireInDays = 365;
          break;
        default:
          // Default to 1 month if plan is not recognized
          membershipEndDate = new Date(startDate);
          membershipEndDate.setMonth(startDate.getMonth() + 1);
          expireInDays = 30;
      }
      
      // Format dates as YYYY-MM-DD for database storage
      membershipEndDate = membershipEndDate.toISOString().split('T')[0];
    }
    

    // 5. Prepare member data
    const memberData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address,
      dateOfBirth,
      gender,
      membershipType: plan, // Using 'plan' from request as 'membershipType'
      membershipStartDate,
      membershipEndDate,
      membershipExpireInDays: expireInDays,
      membershipStatus: "active",
      ownerId // assuming owner is authenticated
    };

    // Add member photo if provided
    if (memberPhoto) {
      memberData.memberPhoto = memberPhoto;
    }

    // 6. Create the member
    const member = await Member.create(memberData);

    // 7. Remove sensitive data before sending response
    const { password, resetpasswordToken, resetpasswordExpires, ...memberDataResponse } = member.toJSON();

    // 8. Log and respond
    console.log(`New member registered: ${member.email} by owner: ${req.user.id}`);
    const gymOwner=await GymOwner.findByPk(ownerId)
    
    await sendMemberWelcomeEmail(email,tempPassword,name,gymOwner.gymName)
    res.status(201).json({
      success: true,
      message: "Member registered successfully",
      data: {
        member: memberDataResponse,
        tempPassword,
        note: "Temporary password generated. Member should change it on first login.",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while registering member",
      details: error.message,
    });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Extract search and filter parameters
    const search = req.query.search || '';
    const membershipType = req.query.membershipType || '';
    const membershipStatus = req.query.membershipStatus || '';
    const gender = req.query.gender || '';
    
    // Build the where clause for filtering
    const whereClause = { ownerId };
    
    // Add search conditions if search term is provided
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Add filter conditions if provided
    if (membershipType) {
      whereClause.membershipType = membershipType;
    }
    
    if (membershipStatus) {
      whereClause.membershipStatus = membershipStatus;
    }
    
    if (gender) {
      whereClause.gender = gender;
    }
    console.log("whereClause",whereClause)
    // Find members with pagination, search, and filters
    const { count, rows: members } = await Member.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'resetpasswordToken', 'resetpasswordExpires'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    console.log("membersdddd",members)
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    
    // Send response
    res.status(200).json({
      success: true,
      message: "Members retrieved successfully",
      data: {
        members,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching members",
      details: error.message,
    });
  }
};

export default { registerMember,getAllMembers };