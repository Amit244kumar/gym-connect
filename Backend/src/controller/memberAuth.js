import {CheckIn, GymOwner, Member,MembershipRenewal, OwnerMembershipPlan } from '../models/index.js';
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Make sure to import crypto
// import logger from "../utils/logger.js";

import { sendMemberWelcomeEmail } from '../helper/emailHelper.js';
import { generateMemberToken } from '../utils/helper.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';


const registerMember = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start transaction
  
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
      startDate: membershipStartDate, 
    } = req.body;
    
    const ownerId = req.user.id;
    const memberPhoto = req.file ? `member/${req.file.filename}` : null;

    // 2. Check if member already exists (email or phone)
    const existingUserWithEmail = await Member.findOne({
      where: { email },
      transaction
    });
    
    if (existingUserWithEmail) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 3. Check if membership plan exists
    const membershipPlan = await OwnerMembershipPlan.findByPk(plan, { transaction });
    if (!membershipPlan) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: "Membership plan not found",
      });
    }

    // 4. Generate a temporary random password
    const tempPassword = crypto.randomBytes(10).toString('base64url').substring(0, 10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 5. Calculate membership end date
    let membershipEndDate = null;
    if (membershipStartDate && plan) {
      const startDate = new Date(membershipStartDate);
      membershipEndDate = new Date(startDate);
      membershipEndDate.setMonth(startDate.getMonth() + membershipPlan.duration);
      membershipEndDate = membershipEndDate.toISOString().split('T')[0];
    }

    // 6. Prepare member data
    const memberData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address,
      dateOfBirth,
      gender,
      membershipStatus: "active",
      ownerId
    };

    // Add member photo if provided
    if (memberPhoto) {
      memberData.memberPhoto = memberPhoto;
    }

    // 7. Create the member within transaction
    const member = await Member.create(memberData, { transaction });

    // 8. Create membership renewal record within transaction
    const memberRenewal = await MembershipRenewal.create({
      memberId: member.id,
      planId: plan,
      renewalDate: membershipStartDate,
      expiryDate: membershipEndDate,
    }, { transaction });

    // 9. Update member with renewal ID
    member.memberRenewalId = memberRenewal.id;
    await member.save({ transaction });

    // 10. Get gym owner details
    const gymOwner = await GymOwner.findByPk(ownerId, { transaction });
    if (!gymOwner) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: "Gym owner not found",
      });
    }

    // 11. Send welcome email (outside transaction as it's not critical for data consistency)
    try {
      await sendMemberWelcomeEmail(email, tempPassword, name, gymOwner.gymName);
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError.message);
      // Don't rollback transaction just because email failed
    }

    // 12. Commit the transaction
    await transaction.commit();

    // 13. Remove sensitive data before sending response
    const { password, resetpasswordToken, resetpasswordExpires, ...memberDataResponse } = member.toJSON();

    // 14. Return success response
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
    // 15. Rollback transaction on any error
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    // 16. Handle specific database errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        error: "Duplicate entry found",
        details: error.errors.map(err => err.message)
      });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors.map(err => err.message)
      });
    }

    // 17. Handle file cleanup if photo was uploaded but transaction failed
    if (req.file) {
      try {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error("Failed to cleanup uploaded file:", cleanupError.message);
      }
    }

    // 18. Log error for debugging
    console.error("Error in registerMember:", error);

    // 19. Return generic server error
    res.status(500).json({
      success: false,
      error: "Server error while registering member",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getAllMembers = async (req, res) => { 
  try {
    const ownerId = req.user.id;
    console.log("owwwwnerId",ownerId)
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
    
    // Find members with pagination, search, and filters
    const { count, rows: members } = await Member.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'resetpasswordToken', 'resetpasswordExpires','registrationUrl'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
          {
            model: MembershipRenewal,  // Misspelled
            as: "renewals",            // Misspelled
            separate: true,   
            limit: 1,
            order: [['createdAt', 'DESC']], 
            attributes: ["renewalDate", "expiryDate"],
            include: [
              {
                model: OwnerMembershipPlan,
                as: "plan", 
                attributes: ["planName"]
              }
            ]
          }
        ]

    });
    console.log("dfsddfgdf",members)  
   
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
      members.forEach(member => {
        if(member.renewals && member.renewals[0]?.expiryDate){
          const endDate = new Date(member.renewals[0]?.expiryDate);
          const today = new Date();
          
          const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          
          member.dataValues.membershipExpireInDays=daysLeft;  
        }
    });
    // Send response
    const totalMember= await Member.count({where:{ownerId}})
    console.log("totalMember",totalMember)
   
    res.status(200).json({
      success: true,
      message: "Members retrieved successfully",
      data: {
        members,
        totalMembers:totalMember,
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

const memberLogin= async (req,res)=>{
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }
    const {email,password}=req.body
    const isExist=await Member.findOne({
      where:{email}
    })
    if(!isExist){
      return res.status(404).json({
        success:false,
        message:"Email not found"
      })
    }
    const isPasswordValid=await isExist.comparePassword(password)
    if(!isPasswordValid){
        return res.status(404).json({
        success:false,
        message:"Password is not valid"
      })
    }
    const token=generateMemberToken(isExist)
    return res.status(201).json({
      success:true,
      message:"login successfully",
      data:token
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while fetching members",
      details: error.message,
    });
  }
}
const memberLogout = async (req, res) => {
  try {
    // In JWT-based auth, logout is typically handled client-side
    // But you can add any cleanup logic here if needed

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
const getMemberProfile=async (req,res)=>{
  try {
    const memberId=req.user.id
    const member=await Member.findByPk(memberId,
      {
        attributes: { exclude: ['password', 'resetpasswordToken', 'resetpasswordExpires']  },
        include:{
          model:OwnerMembershipPlan,
          as:"membershipPlan",
          // include:{
          //   model:MembershipPlanFeature,
          //   as:"features"
          // }
        }
      },
    )
    //count visit in first 30 days
    const visitCount=await CheckIn.count({
      where:{memberId},
      createdAt:{
        [Op.gte]:member.membershipStartDate,
        [Op.lte]:member.membershipStartDate+ 1000 * 60 * 60 * 24 * 30
      }
    })
    const lastVisit=await CheckIn.findOne({
      where:{memberId},
      order:[['createdAt','DESC']]
    })
    console.log("lastVisit",lastVisit)
    console.log("memberprofiwwwwle",visitCount)
    if(!member){
      return res.status(404).json({
        success:false,
        message:"Member not found"
      })
    }
    member.visitCount=visitCount
    console.log("membeseeeedsdr",member)
    res.status(200).json({
      success:true,
      message:"Member profile fetched successfully",
      data:{...member.toJSON(),visitCount,lastVisit:lastVisit?lastVisit.createdAt:null}
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while fetching member profile",
      details: error.message,
    });
  }
}
  
const memberCheckIn=async (req,res)=>{
  try {
    const memberId=req.user.id
    const {qrData}=req.body
    console.log("qrData",qrData)
    const member=await Member.findByPk(memberId)
    console.log("memberCheckIn",member,qrData)
    if(!member){
      return res.status(404).json({
        success:false,
        message:"Member not found"
      })
    }
    // Add check-in logic here (e.g., update lastCheckIn field)
    const isQRValid= await GymOwner.findOne({where:{id:qrData}})
    if(!isQRValid){
      res.status(400).json({
        success:false,
        message:"Invalid QR code"
      })  
    }
    let daysLeft = null;
    if(member.membershipEndDate){
      const endDate = new Date(member.membershipEndDate);
      const today = new Date();
        
      daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    }
    console.log("membesdsdr",member,daysLeft)
    if(daysLeft!==null && daysLeft<=0){
      const isExist=await CheckIn.findOne({
        where:{
          memberId:member.id,
          checkInStatus:'failed',
          createdAt:{
            [Op.gte]:new Date(new Date().setHours(0,0,0,0)),
            [Op.lte]:new Date(new Date().setHours(23,59,59,999))
          }
        }
      })
      console.log("isExist",isExist)
      if(!isExist){
        const expired=await CheckIn.create({
          memberId: member.id,
          ownerId: isQRValid.id,
          checkInStatus: 'failed',
        });
        console.log("sdfsdfs",expired)
      }
      return res.status(400).json({
        success:false,
        message:"Membership has expired. Please renew your membership to check in.",
        data:{isMembershipExpired:true}
      })
    }

    const isAlreadyCheckedIn=await CheckIn.findOne({
      where:{
        memberId:member.id,
        checkInStatus:'success',
        createdAt:{
          [Op.gte]:new Date(new Date().setHours(0,0,0,0)),
          [Op.lte]:new Date(new Date().setHours(23,59,59,999))
        }
      }
    })
    console.log("wwwwwwwwww",isAlreadyCheckedIn)
    if(isAlreadyCheckedIn){
      return res.status(400).json({
        success:false, 
        message:"You already checked in today",
        data:{isAlreadyCheckedIn:true}
      })
    }
    const checkin = await CheckIn.create({
      memberId: member.id,
      ownerId: isQRValid.id,
      check_status: 'success',
    });
    console.log("checqwaswkin",checkin)
    res.status(200).json({
      success:true,
      message:"successfully checked in",
      data:checkin
    })
  } catch (error) {
    res.status(500).json({
      success: false, 
      error: "Server error while member check-in",
      details: error.message,
    });
  }
};

// const getMemberStats=async (req,res)=>{
//   try {
//     const memberId=req.user.id
//     // Fetch and calculate statistics as needed
//     const member = await Member.findByPk(memberId,
//       attributes: { include: [] }
//     );
//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     res.status(200).json({
//       success:true,
//       message:"Member statistics fetched successfully",
//       data:{  
//         // Add statistics data here
//       }
//     })
//   } 
//   catch (error) {
//     res.status(500).json({
//       success: false,
//       error: "Server error while fetching member statistics",
//       details: error.message,
//     });
//   }
// };
export default { registerMember,getAllMembers,memberLogin,memberLogout,getMemberProfile,memberCheckIn };