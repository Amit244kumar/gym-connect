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
import MembershipRenewal from './models/MembershipRenewal.js';

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
// await sequelize.sync({alter:true}); 
// await Member.sync({alter:true});
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

app.use('/public', express.static(path.join(__dirname, './public')));


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, }));

// Compression middleware
app.use(compression());

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
