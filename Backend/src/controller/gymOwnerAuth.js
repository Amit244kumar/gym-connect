import { CheckIn, GymOwner, Member, OwnerMembershipPlan } from '../models/index.js';
import { validationResult } from 'express-validator';
import {  generateEmailVerificationToken, generatePhoneVerificationOTP, generateOwnerToken } from '../utils/helper.js';
import { sendEmailVerification, sendPasswordResetEmail } from '../helper/emailHelper.js';
import crypto from "crypto";
import Sequelize from 'sequelize'; // Import Sequelize
const Op = Sequelize.Op; // Then get Op from it
import fs  from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gym Owner Registration
export const registerGymOwner = async (req, res) => { 
  try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { 
        ownerName, 
        email, 
        phone, 
        password, 
        gymName
      } = req.body;

      // Check if email already exists
      const existingEmail = await GymOwner.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Check if gym name already exists
      const existingGym = await GymOwner.findOne({ where: { gymName } });
      if (existingGym) {
        return res.status(400).json({
          success: false,
          message: 'Gym name already taken'
        });
      }

      // Generate verification codes and expiry times
      const emailVerificationToken = generateEmailVerificationToken();
      const phoneVerificationCode = generatePhoneVerificationOTP();
      
      // Set expiry times (5 minutes for email, 10 minutes for OTP)
      const emailVerificationExpires = new Date(Date.now() + 5 * 60 * 1000);
      const phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
      console.log("Fileffff",req.file)
      // Create gym owner
      const gymOwner = await GymOwner.create({
        ownerName,
        email: email.toLowerCase(),
        phone,
        password,
        gymName,
        ownerPhoto: req.file ? `owner/${req.file.filename}` : null, // Save file path if uploaded
        subscriptionPlanType: 'trial',
        subscriptionStatus: 'active',
        trialStart: new Date(),
        trialEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        isEmailVerified: false,
        isPhoneVerified: false,
        emailVerificationToken,
        emailVerificationExpires,
        phoneVerificationCode,
        phoneVerificationExpires,
      });

      // Generate registration URL
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const registrationUrl = gymOwner.generateRegistrationUrl(baseUrl);
      gymOwner.registrationUrl = registrationUrl;
      await gymOwner.save();

      // Generate JWT token
      const token = generateOwnerToken(gymOwner);
      
      // Send email verification
      await sendEmailVerification(email, emailVerificationToken, ownerName);

      // Remove password from response
      const ownerData = gymOwner.toJSON();
      delete ownerData.password;

      res.status(201).json({
        success: true,
        message: 'Gym owner registered successfully. Please verify your email and phone number.',
        data: {
          owner: ownerData,
          token,
          registrationUrl,
          trialEnd: gymOwner.trialEnd,
          verification: {
            emailVerificationToken,
            emailVerificationExpires,
            phoneVerificationCode,
            phoneVerificationExpires
          }
        }
      });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const isGymNameUnique = async (req, res) => {
  try {
    const { gymName } = req.params;
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     errors: errors.array() 
    //   });
    // }
    // const { gymName } = req.params;

    if (!gymName || gymName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Gym name is required',
      });
    }

    // Check if the gym name already exists
    const existingGym = await GymOwner.findOne({ where: { gymName } });

    if (existingGym) {
      return res.status(200).json({
        success: true,
        data: false,
        message: 'Gym name is already taken',
      });
    } else {
      return res.status(200).json({
        success: true,
        data: true,
        message: 'Gym name is available',
      });
    }

  } catch (error) {
    console.error('Gym name check error:', error);
    return res.status(500).json({
      success: false,
      data:null,
      message: 'Internal server error',
    });
  }
};

// Gym Owner Login
export const loginGymOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("dfgsrersreef",email,password)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    console.log("dsfsdfsfsewafbji ")
    // Find owner by email
    const owner = await GymOwner.findOne({ 
      where: { email: email.toLowerCase() },
    });
    console.log("sdfsdfsd",owner)
    if (!owner) {
      return res.status(401).json({
        success: false,
        message: 'Email is not register'
      });
    }

    // Verify password
    const isPasswordValid = await owner.comparePassword(password);
    console.log('sfsdqwatu',isPasswordValid)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password is Invalid'
      });
    }

    // Check subscription status
    const now = new Date();
    let subscriptionStatus = owner.subscriptionStatus;
    console.log("sqartdfsd")
    if (owner.subscriptionPlanType === 'trial' && owner.trialEnd && now > owner.trialEnd) {
      subscriptionStatus = 'expired';
      await owner.update({ subscriptionStatus: 'expired' });
    }


    // Generate JWT token
    const token = generateOwnerToken(owner);
    // // Update last login and login count
    // await owner.update({
    //   lastActive: new Date()
    // });

    // Remove password from response
    // const ownerData = owner.toJSON();
    // delete ownerData.password;

    res.json({
      success: true,
      message: 'Login successfully',
      data: {token,slug:owner.slug}
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

// Get Gym Owner Profile
export const getProfile = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const owner = await GymOwner.findByPk(ownerId, {
      attributes: { exclude: ['password'] },
      include:[
        {
          model:OwnerMembershipPlan,
          attributes:["id","planName"]
        }
      ]
    });
    
    console.log("Ownersdfsd",owner.dataValues.OwnerMembershipPlans[0].id)
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Gym owner not found'
      });
    }

    const members = await Member.count({
      where: { ownerId },
      include:{
        model:OwnerMembershipPlan
      },
    });
    const recentMembers = await Member.findAll({
      where: { ownerId },
      attributes: { exclude: ['password','resetpasswordToken','resetpasswordExpires'] },
      order: [['createdAt', 'DESC']],
      limit: 5,
      include:{
        model:OwnerMembershipPlan,
        attributes:["planName"]
      },
    });
    // console.log("sdfsdd",recentMembers)
     recentMembers.forEach(member => {
      if(member.membershipEndDate){
        const endDate = new Date(member.membershipEndDate);
        const today = new Date();
        console.log("sdfqwaqsdd",member)
        
        const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        console.log("daysLefteqeqqqq",Number(daysLeft)<=0)
        if(Number(daysLeft)<=0){
          console.log("daysLeft",daysLeft)
          member.dataValues.membershipExpireInDays=0;  
          member.dataValues.membershipStatus='expired';
          member.save();
        }else{
          console.log("dayssdfLeft",daysLeft)
          member.dataValues.membershipExpireInDays=daysLeft;  
        }
      }
      console.log("membesdsdr",member)
    });
    
    console.log("Members Count",members)
    // Calculate trial days information
    const trialStart = new Date(owner.trialStart);
    const trialEnd = new Date(owner.trialEnd);
    const today = new Date();

    const diffTime = trialEnd - trialStart;
    const totalTrialDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const timeUntilTrialEnd = trialEnd - today;
    const daysLeft = Math.ceil(timeUntilTrialEnd / (1000 * 60 * 60 * 24));
    const totalCheckInsToday=await CheckIn.count({
      where:{
        ownerId,
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          [Op.lte]: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    });

    // Get check-in distribution by hour for today
    const checkInData = await getCheckInDistribution(ownerId);
 
    let memberDistribution = [];
    const colorPalette = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
    if (owner.dataValues.OwnerMembershipPlans) {
        // Create promises array from the map operation
        const promises = owner.dataValues.OwnerMembershipPlans.map(async (plan,index) => {
            const count = await Member.count({
                where: {
                    ownerId,
                    membershipType: plan.id
                }
            });
            const color = colorPalette[index % colorPalette.length];
            return {
                name: plan.planName,
                value: count,
                color:color
            };
        });

        // Wait for all promises
        memberDistribution = await Promise.all(promises);
    }
    res.json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        totalMembers:members,
        totalCheckInsToday,
        ...owner.dataValues,
        memberDistribution,
        checkInData,
        trialInfo: {
          totalTrialDays,
          daysLeft: Math.max(0, daysLeft),
          trialStatus: today <= trialEnd ? 'active' : 'expired',
          isTrialActive: today <= trialEnd
        },
        recentMembers
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
    });
  }
};

// Update Gym Owner Profile
export const updateProfile = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { ownerName, gymName } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    console.log("Request data:", req.file, ownerName, gymName);
    
    const owner = await GymOwner.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Gym owner not found'
      });
    }

    if (gymName) {
      // Check if gym name already exists
      const existingGym = await GymOwner.findOne({
        where: {
          gymName,
          id: { [Op.ne]: ownerId } // Exclude current owner
        }
      });
      if (existingGym) {
        return res.status(409).json({
          success: false,
          message: 'Gym name already taken'
        });
      }
    }

    let oldImageFilename = null;
    console.log("Reqfile", req.file);
    
    // Store the old image filename before any updates
    if (owner.ownerPhoto) {
      oldImageFilename = owner.ownerPhoto;
    }

    // Update owner data
    const updateData = { ownerName, gymName ,slug:gymName.toLowerCase().replace(/\s+/g, '-')};
    
    if (req.file) {
      updateData.ownerPhoto = `owner/${req.file.filename}`;
    }

    const updatedOwner = await owner.update(updateData);

    // Remove password from response
    const ownerData = updatedOwner.toJSON();
    delete ownerData.password;
    console.log("UpdatedData ", ownerData);

    // Delete old image file after successful update
    if (req.file && oldImageFilename) {
      console.log('Old image to delete:', oldImageFilename);
      
      // Use absolute path instead of relative path
      const oldImagePath = path.join(__dirname, '..', 'public', oldImageFilename);
      console.log("Old image path:", oldImagePath);
      
      try {
        // Check if file exists before trying to delete
        await fs.access(oldImagePath);
        await fs.unlink(oldImagePath);
        console.log('Old image deleted successfully:', oldImageFilename);
      } catch (unlinkError) {
        if (unlinkError.code === 'ENOENT') {
          console.log('Old image file not found, skipping deletion:', oldImageFilename);
        } else {
          console.error('Error deleting old image:', unlinkError);
        }
        // Don't throw error here, as the main operation was successful
      }
    }
    const trialStart = new Date(ownerData.trialStart);
    const trialEnd = new Date(ownerData.trialEnd);
    const today = new Date();

    const diffTime = trialEnd - trialStart;
    const totalTrialDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const timeUntilTrialEnd = trialEnd - today;
    const daysLeft = Math.ceil(timeUntilTrialEnd / (1000 * 60 * 60 * 24));
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...ownerData,
        trialInfo: {
          totalTrialDays,
          daysLeft: Math.max(0, daysLeft),
          trialStatus: today <= trialEnd ? 'active' : 'expired',
          isTrialActive: today <= trialEnd
      }
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    // Find user by email
    const user = await GymOwner.findOne({
      where: { email }
    });
    console.log("Usfsdser",user)
    // Don't reveal if the user exists or not for security reasons
    if (!user) {
      return res.status(200).json({ 
        success: true, 
        message: 'you are not registered with us Please Sign Up' 
      });
    }
    
    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("Reset Token",resetToken)
    // Set token and expiration time (1 hour)
    user.resetpasswordToken = resetToken;
    user.resetpasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  
    // Save the user
    await user.save();
    console.log("Ussdfdser",user)
    // Send the email
    const emailResult = await sendPasswordResetEmail(
      user.email, 
      resetToken, 
      user.name
    );
    console.log("Email jjnjj",emailResult.success)
    if (!emailResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send password reset email' 
      });
    }
    
    // Return success response
    console.log("Email sent successfully")  
    return res.status(200).json({ 
      success: true, 
      message: 'Password reset email sent successfully' 
    });
  } catch (error) {
    console.error('Error in forgot-password route:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
// Verify Reset Token
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params; // Get token from URL params
    
    if(!token){
      return res.status(400).json({ 
        success: false, 
        message: 'Reset token is required' 
      });
    }
    console.log("Tokesdfsdn",token)  
    // Find user by reset token and check if it's still valid
    const user = await GymOwner.findOne({
       where: {
        resetpasswordToken: token,
        resetpasswordExpires: { [Op.gt]: Date.now() } // Token not expired
      }
    }); 
    console.log("sdfsddssdf",user)
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token', 
        data:{isVerifyingToken:false}
      });
    } 
    // Token is valid
    return res.status(200).json({ 
      success: true, 
      message: 'Reset token is verified successfully',
      data:{isVerifyingToken:true}
    });
  } catch (error) {
    console.error('Error in verify-reset-token route:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
// reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    // Find owner by reset token and check if it's still valid
    const owner = await GymOwner.findOne({
       where: {
        resetpasswordToken: token,
        resetpasswordExpires: { [Op.gt]: Date.now() } // Token not expired
      }
    });
    
    if (!owner) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }
    console.log("New Password",newPassword,owner)
    // Update the owner's password
    await owner.update({
      password: newPassword, // This will trigger the beforeUpdate hook
      resetpasswordToken: null,
      resetpasswordExpires: null
    });
    console.log("Owner",owner)      
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });
  } catch (error) {
    console.error('Error in reset-password route:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const logout = async (req, res) => {
  try {
    
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

export const resendEmailVerification = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const owner = await GymOwner.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Gym owner not found'
      });
    }
    if (owner.isEmailVerified) {
      return res.json({
        success: true,
        message: 'Email is already verified'
      });
    } 
    // Generate new verification token and expiry
    const emailVerificationToken = generateEmailVerificationToken();
    console.log("Tokensdfdffd",emailVerificationToken)
    const emailVerificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    owner.emailVerificationToken = emailVerificationToken;
    owner.emailVerificationExpires = emailVerificationExpires;
    await owner.save(); 
    // Send verification email
    await sendEmailVerification(owner.email, emailVerificationToken, owner.ownerName);
    res.json({
      success: true,
      message: 'Verification email resent successfully'
    });
  }
  catch (error) {
    console.error('Resend email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
// Verify Email

export const verifyEmail = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const {code}=req.body
    console.log("Codesdsd",code,ownerId)
    const owner = await GymOwner.findByPk(ownerId);
    if (!owner) {
      return res.json({
        success: false,
        message: 'Gym owner not found'
      });
    }

    if (owner.isEmailVerified) {
      return res.json({
        success: true,
        message: 'Email is already verified'
      });
    }
    if(owner.emailVerificationExpires < new Date()){
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }
    if (owner.emailVerificationToken !== code) {  
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }
    // Verify email
    owner.isEmailVerified = true;
    owner.emailVerificationToken = null;
    owner.emailVerificationExpires = null;
    await owner.save();
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  }catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Email verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
// Refresh Token (optional)
export const refreshToken = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const owner = await GymOwner.findByPk(ownerId, {
      attributes: { exclude: ['password'] }
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Gym owner not found'
      });
    }

    // Generate new token
    const newToken = generateOwnerToken(owner);

    res.json({
      success: true,
      data: { token: newToken }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


export const getCheckInStats = async (req, res) => {
  try {
    const {page = 1, limit = 10} = req.query;
    const ownerId = req.user.id;
    const offset = (page - 1) * limit;
    const { count, rows: checkIns } = await CheckIn.findAndCountAll({
      where: { 
        ownerId ,
        createdAt:{
          [Op.gte]:new Date(new Date().setHours(0,0,0,0)),
          [Op.lte]:new Date(new Date().setHours(23,59,59,999))
        }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: {
        model: Member,
        as: 'member',
        attributes: ['id', 'name', 'email', 'phone', 'memberPhoto']
      },
    });
    const success=checkIns.filter((checkIn)=>checkIn.checkInStatus==="success")
    const failed=checkIns.filter((checkIn)=>checkIn.checkInStatus==="failed")
    console.log("Check-Ins",failed)
    res.json({
      success: true,
      message: 'Check-in stats fetched successfully',
      data: {
        totalCheckIns: count,
        successfulCheckIns: success.length,
        failedCheckIns: failed.length,
        checkIns,
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
      }
    });
  } catch (error) {
    console.error('Get check-in stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get check-in stats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to get check-in distribution by hour
async function getCheckInDistribution(ownerId) {
  try {
    // Define time slots (2-hour intervals)
    const timeSlots = [
      { start: 6, end: 8, label: '6 AM' },
      { start: 8, end: 10, label: '8 AM' },
      { start: 10, end: 12, label: '10 AM' },
      { start: 12, end: 14, label: '12 PM' },
      { start: 14, end: 16, label: '2 PM' },
      { start: 16, end: 18, label: '4 PM' },
      { start: 18, end: 20, label: '6 PM' },
      { start: 20, end: 22, label: '8 PM' },
      { start: 22, end: 24, label: '10 PM' }, // Optional: 10 PM slot
      { start: 0, end: 6, label: '12 AM' }   // Optional: Midnight to 6 AM slot
    ];

    // Get today's start and end
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get all check-ins for today
    const checkIns = await CheckIn.findAll({
      where: {
        ownerId,
        createdAt: {
          [Op.gte]: todayStart,
          [Op.lte]: todayEnd
        }
      },
      attributes: ['createdAt']
    });

    // Initialize result array with 0 counts
    const result = timeSlots.map(slot => ({
      time: slot.label,
      count: 0
    }));

    // Count check-ins for each time slot
    checkIns.forEach(checkIn => {
      const hour = checkIn.createdAt.getHours();
      
      // Find which time slot this hour belongs to
      for (let i = 0; i < timeSlots.length; i++) {
        if (hour >= timeSlots[i].start && hour < timeSlots[i].end) {
          result[i].count++;
          break;
        }
      }
    });

    return result;

  } catch (error) {
    console.error('Error getting check-in distribution:', error);
    // Return default structure if there's an error
    return [
      { time: '6 AM', count: 0 },
      { time: '8 AM', count: 0 },
      { time: '10 AM', count: 0 },
      { time: '12 PM', count: 0 },
      { time: '2 PM', count: 0 },
      { time: '4 PM', count: 0 },
      { time: '6 PM', count: 0 },
      { time: '8 PM', count: 0 }
    ];
  }
}

// // Alternative: If you want to get check-in data for the last 7 days
// async function getCheckInDistributionLast7Days(ownerId) {
//   try {
//     const days = [];
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
      
//       const dayStart = new Date(date);
//       dayStart.setHours(0, 0, 0, 0);
      
//       const dayEnd = new Date(date);
//       dayEnd.setHours(23, 59, 59, 999);

//       const count = await CheckIn.count({
//         where: {
//           ownerId,
//           createdAt: {
//             [Op.gte]: dayStart,
//             [Op.lte]: dayEnd
//           }
//         }
//       });

//       days.push({
//         date: date.toLocaleDateString('en-US', { weekday: 'short' }),
//         count: count
//       });
//     }

//     return days;
//   } catch (error) {
//     console.error('Error getting 7-day check-in distribution:', error);
//     return [];
//   }
// }