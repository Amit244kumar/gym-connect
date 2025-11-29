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


// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { logger } from './utils/logger.js';

// Import database connection
import sequelize from './config/database.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT =5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Connect to database
sequelize.authenticate()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Error:", err)); 
sequelize.sync(); 
// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

// CORS configuration
const corsOptions = {
  origin:"*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type","X-Requested-With", "Authorization", "ngrok-skip-browser-warning"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
//   message: {
//     error: 'Too many requests from this IP, please try again later.',
//     retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 / 60),
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Speed limiting
// const speedLimiter = slowDown({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   delayAfter: 50, // allow 50 requests per 15 minutes, then...
//   delayMs: 500, // begin adding 500ms of delay per request above 50
// });
// sequelize.sync({ alter: true });
app.use('/public', express.static(path.join(__dirname, './public')));
// app.use('/api/', limiter);
// app.use('/api/', speedLimiter);

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
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send(`Welcome to GymPro API v${API_VERSION}`);
})
// API routes
app.use('/api', router);


// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT,"0.0.0.0", () => {
 console.log(`GymPro server running on port ${PORT}`);
 
});



export default app;
