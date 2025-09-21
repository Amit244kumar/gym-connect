import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/api.js';
// // Import routes
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// import gymRoutes from './routes/gyms.js';
// import memberRoutes from './routes/members.js';
// import membershipRoutes from './routes/memberships.js';
// import qrRoutes from './routes/qr.js';
// import analyticsRoutes from './routes/analytics.js';
// import paymentRoutes from './routes/payments.js';
// import notificationRoutes from './routes/notifications.js';
// // import gymOwnerRoutes from './routes/gymOwners.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { logger } from './utils/logger.js';

// Import database connection
import  sequelize  from './config/database.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Connect to database
sequelize.authenticate()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Error:", err)); 
sequelize.sync(); 
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:8080'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 / 60),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Speed limiting
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 50
});
sequelize.sync({ alter: true });

app.use('/api/', limiter);
app.use('/api/', speedLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



// API routes
app.use('/api', router);



// app.use(`/api/${API_VERSION}/auth`, authRoutes);
// app.use(`/api/${API_VERSION}/users`, userRoutes);
// app.use(`/api/${API_VERSION}/gyms`, gymRoutes);
// app.use(`/api/${API_VERSION}/members`, memberRoutes);
// app.use(`/api/${API_VERSION}/memberships`, membershipRoutes);
// app.use(`/api/${API_VERSION}/qr`, qrRoutes);
// app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
// app.use(`/api/${API_VERSION}/payments`, paymentRoutes);
// app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
// // app.use(`/api/${API_VERSION}/gym-owners`, gymOwnerRoutes);

// // API documentation
// app.get(`/api/${API_VERSION}`, (req, res) => {
//   res.json({
//     message: 'GymPro API',
//     version: API_VERSION,
//     endpoints: {
//       auth: `/api/${API_VERSION}/auth`,
//       users: `/api/${API_VERSION}/users`,
//       gyms: `/api/${API_VERSION}/gyms`,
//       gymOwners: `/api/${API_VERSION}/gym-owners`,
//       members: `/api/${API_VERSION}/members`,
//       memberships: `/api/${API_VERSION}/memberships`,
//       qr: `/api/${API_VERSION}/qr`,
//       analytics: `/api/${API_VERSION}/analytics`,
//       payments: `/api/${API_VERSION}/payments`,
//       notifications: `/api/${API_VERSION}/notifications`,
//     },
//     documentation: '/api/docs',
//   });
// });

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
 console.log(`GymPro server running on port ${PORT}`);
 
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default app;
