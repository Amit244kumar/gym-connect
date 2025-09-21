# GymPro Backend API

A professional, scalable backend API for the GymPro gym management system built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Management**: Complete user registration, authentication, and profile management
- **Gym Management**: Gym owners can manage their gym information and settings
- **QR Code System**: Secure QR code generation and scanning for gym entry
- **Membership Tracking**: Comprehensive membership management and renewal system
- **Real-time Analytics**: Dashboard with gym statistics and member insights
- **Security**: JWT authentication, rate limiting, input validation, and security headers
- **Scalable Architecture**: Modular design with proper separation of concerns

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Express-validator and Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston with file rotation
- **QR Codes**: qrcode library
- **File Upload**: Multer
- **Email**: Nodemailer
- **SMS**: Twilio
- **Payments**: Stripe

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database and configuration
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API route handlers
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── logs/                # Application logs
├── uploads/             # File uploads
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB instance running
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Ensure MongoDB is running
   # Update MONGODB_URI in .env
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/gympro

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Other configurations...
```

### Database Models

- **User**: Gym members and owners with comprehensive profiles
- **Gym**: Gym information, settings, and business details
- **Membership**: Membership plans and tracking
- **CheckIn**: Member entry logs and analytics

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile
- `PUT /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/logout` - User logout

### Users
- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PATCH /api/v1/users/:id/block` - Block/unblock user

### Gyms
- `POST /api/v1/gyms` - Create new gym
- `GET /api/v1/gyms` - Get all gyms (public)
- `GET /api/v1/gyms/:id` - Get single gym
- `PUT /api/v1/gyms/:id` - Update gym
- `DELETE /api/v1/gyms/:id` - Delete gym
- `GET /api/v1/gyms/:id/members` - Get gym members

### QR Codes
- `POST /api/v1/qr/generate` - Generate QR code for member
- `POST /api/v1/qr/scan` - Scan QR code for entry
- `POST /api/v1/qr/bulk-generate` - Generate multiple QR codes
- `GET /api/v1/qr/stats/:gymId` - Get QR statistics

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Rate Limiting**: Prevent abuse with request throttling
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable cross-origin resource sharing
- **Account Locking**: Automatic account lockout after failed attempts

## 📊 Logging

The application uses Winston for comprehensive logging:

- **Console Logging**: Colored output for development
- **File Logging**: Rotated log files for production
- **Error Tracking**: Detailed error logging with stack traces
- **Performance Monitoring**: Request timing and performance metrics

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --grep "User Model"
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production MongoDB URI
- Set up proper CORS origins
- Configure logging levels

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Performance & Scalability

- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis integration ready
- **Load Balancing**: Horizontal scaling support
- **Monitoring**: Health check endpoints

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run typecheck
```

### Database Migrations

```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Updates

Stay updated with the latest features and security patches by regularly pulling from the main branch.

---

**Built with ❤️ for the fitness community**
