import  GymOwner  from '../models/gymOwner.js';
import { validationResult } from 'express-validator';
import { generateToken, generateEmailVerificationToken, generatePhoneVerificationOTP } from '../utils/helper.js';
import { sendEmailVerification, sendPasswordResetEmail } from '../helper/emailHelper.js';
import crypto from "crypto";
import Sequelize from 'sequelize'; // Import Sequelize
const Op = Sequelize.Op; // Then get Op from it

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
        ownerPhoto: req.file ? req.file.filename : null, // Save file path if uploaded
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
      const token = generateToken(gymOwner);
      
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
    const token = generateToken(owner);
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
      attributes: { exclude: ['password'] }
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Gym owner not found'
      });
    }

    // Calculate trial days information
    const trialStart = new Date(owner.trialStart);
    const trialEnd = new Date(owner.trialEnd);
    const today = new Date();

    const diffTime = trialEnd - trialStart;
    const totalTrialDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const timeUntilTrialEnd = trialEnd - today;
    const daysLeft = Math.ceil(timeUntilTrialEnd / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        profileImage: owner.ownerPhoto,
        ...owner.dataValues,
        trialInfo: {
          totalTrialDays,
          daysLeft: Math.max(0, daysLeft),
          trialStatus: today <= trialEnd ? 'active' : 'expired',
          isTrialActive: today <= trialEnd
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update Gym Owner Profile
export const updateProfile = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.email; // Email shouldn't be changed
    delete updateData.gymName; // Gym name shouldn't be changed
    delete updateData.password; // Password update handled separately

    const owner = await GymOwner.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Gym owner not found'
      });
    }

    // Update owner
    await owner.update(updateData);

    // Remove password from response
    const ownerData = owner.toJSON();
    delete ownerData.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { owner: ownerData }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
 
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Ejkkmail",email)
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
// export const changePassword = async (req, res) => {
//   try {
//     const ownerId = req.user.id;
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current password and new password are required'
//       });
//     }

//     if (newPassword.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message: 'New password must be at least 8 characters long'
//       });
//     }

//     const owner = await GymOwner.findByPk(ownerId, {
//       attributes: { exclude: [] } // Include password for comparison
//     });

//     if (!owner) {
//       return res.status(404).json({
//         success: false,
//         message: 'Gym owner not found'
//       });
//     }

//     // Verify current password
//     const isCurrentPasswordValid = await owner.comparePassword(currentPassword);
//     if (!isCurrentPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }

//     // Update password
//     await owner.update({ password: newPassword });

//     res.json({
//       success: true,
//       message: 'Password changed successfully'
//     });

//   } catch (error) {
//     console.error('Change password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to change password',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// Logout (optional - for session invalidation if needed)
export const logout = async (req, res) => {
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
    const newToken = generateToken(owner);

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
