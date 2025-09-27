// backend/src/services/emailService.ts
import nodemailer from 'nodemailer';
import {config} from '../config.js';
// Create a transporter object using SMTP transport
const createTransporter = () => {
  // For production, use your actual SMTP credentials
  // For development, you can use a service like Ethereal or Mailtrap
  console.log("Config in emailHelper",config.HOST,config. PORT,config.USER)
  const option={
    host: config.HOST,
    port: config.PORT,
    // secure: config.SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: config.USER,
      pass: config.PASS,
    },
  }
  return nodemailer.createTransport(option);
};

export const sendPasswordResetEmail = async (to,resetToken,userName) => {
  try {
    const transporter = createTransporter();
    console.log("Transporter",transporter)
    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP server is ready to take messages');
    // Create the reset URL - adjust this based on your frontend URL
    const resetUrl = `${config.FRONTEND_URL}reset-password/${resetToken}`;
    
    // Email content
    const mailOptions = {
      from: "GymPro <noreply@gympro.com>",
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0; font-size: 28px;">GymPro</h1>
            <p style="margin: 10px 0; color: #64748b;">Your Fitness Management Platform</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
            <p style="margin-bottom: 20px; line-height: 1.5;">
              ${userName ? `Hi ${userName},` : 'Hello,'}
            </p>
            <p style="margin-bottom: 20px; line-height: 1.5;">
              We received a request to reset the password for your account. If you made this request, click the button below to set a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="margin-bottom: 20px; line-height: 1.5;">
              If you didn't request a password reset, you can safely ignore this email. Your account security is important to us.
            </p>
            
            <p style="margin-bottom: 0; line-height: 1.5; font-size: 14px; color: #64748b;">
              This link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 14px; color: #64748b;">
            <p style="margin: 0 0 10px 0;">
              If you're having trouble clicking the password reset button, copy and paste the following URL into your web browser:
            </p>
            <p style="margin: 0; word-break: break-all;">
              ${resetUrl}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            <p style="margin: 0 0 10px 0;">
              © ${new Date().getFullYear()} GymPro. All rights reserved.
            </p>
            <p style="margin: 0;">
              If you have questions, contact our support team at support@gympro.com
            </p>
          </div>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      preview: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};
export const sendEmailVerification = async (to, verificationCode, userName) => {
  try {
    const transporter = createTransporter();
    console.log("Transporter", transporter);
    
    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP server is ready to take messages');

    // Email content
    const mailOptions = {
      from: "GymPro <noreply@gympro.com>",
      to,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0; font-size: 28px;">GymPro</h1>
            <p style="margin: 10px 0; color: #64748b;">Your Fitness Management Platform</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e293b; margin-top: 0;">Verify Your Email Address</h2>
            <p style="margin-bottom: 20px; line-height: 1.5;">
              ${userName ? `Hi ${userName},` : 'Hello,'}
            </p>
            <p style="margin-bottom: 20px; line-height: 1.5;">
              Thank you for signing up with GymPro! To complete your registration and activate your account, please use the following verification code:
            </p>
            
            <!-- Verification Code Display -->
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #1e293b; color: white; padding: 20px; border-radius: 8px; display: inline-block;">
                <div style="font-size: 14px; margin-bottom: 8px; color: #94a3b8;">VERIFICATION CODE</div>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${verificationCode}
                </div>
              </div>
            </div>
            
            <p style="margin-bottom: 20px; line-height: 1.5;">
              Enter this code in the verification field on our website or app to verify your email address.
            </p>
            
            <p style="margin-bottom: 0; line-height: 1.5; font-size: 14px; color: #64748b;">
              This code will expire in 5 minutes for security reasons.
            </p>
          </div>
          
          <div style="background-color: #fffbeb; border: 1px solid #fed7aa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">📱 Where to enter the code?</h3>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #92400e;">
              • Go to your GymPro account settings<br>
              • Find the email verification section<br>
              • Enter the code above and click "Verify"
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            <p style="margin: 0 0 10px 0;">
              © ${new Date().getFullYear()} GymPro. All rights reserved.
            </p>
            <p style="margin: 0;">
              If you didn't create an account with GymPro, please ignore this email.
            </p>
          </div>
        </div>
      `,
      
      // Optional: Text version for email clients that don't support HTML
      text: `
        Verify Your Email Address
        
        Hi ${userName || 'there'},
        
        Thank you for signing up with GymPro! To complete your registration, please use the following verification code:
        
        Verification Code: ${verificationCode}
        
        Enter this code in the verification field on our website or app to verify your email address.
        
        This code will expire in 5 minutes.
        
        If you didn't create an account with GymPro, please ignore this email.
        
        © ${new Date().getFullYear()} GymPro. All rights reserved.
      `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      preview: nodemailer.getTestMessageUrl(info)
    };
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send verification email'
    };
  }
};

export const sendWelcomeEmail = async (to, userName, loginUrl) => {
  try {
    const transporter = createTransporter();
    
    // Email content
    const mailOptions = {
      from: "GymPro <noreply@gympro.com>",
      to,
      subject: 'Welcome to GymPro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316; margin: 0; font-size: 28px;">GymPro</h1>
            <p style="margin: 10px 0; color: #64748b;">Your Fitness Management Platform</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e293b; margin-top: 0;">Welcome to GymPro!</h2>
            <p style="margin-bottom: 20px; line-height: 1.5;">
              Hi ${userName},
            </p>
            <p style="margin-bottom: 20px; line-height: 1.5;">
              Thank you for registering with GymPro. We're excited to have you on board!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Login to Your Account
              </a>
            </div>
            
            <p style="margin-bottom: 20px; line-height: 1.5;">
              If you have any questions or need assistance getting started, don't hesitate to contact our support team.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            <p style="margin: 0 0 10px 0;">
              © ${new Date().getFullYear()} GymPro. All rights reserved.
            </p>
            <p style="margin: 0;">
              If you have questions, contact our support team at support@gympro.com
            </p>
          </div>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId,
      preview: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};