import dotenv from 'dotenv';
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,

  HOST: process.env.SMTP_HOST,
  PORT: process.env.SMTP_PORT,
  SECURE: process.env.SMTP_SECURE, // true for 465, false for other ports
  USER: process.env.SMTP_USER ,
  PASS: process.env.SMTP_PASS ,

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8080/',
}

export {config};