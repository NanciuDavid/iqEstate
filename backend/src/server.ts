import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';

// Import route modules
import simpleAuthRoutes from './routes/simpleAuth.routes';
import propertiesRoutes from './routes/properties.routes';
import predictionRoutes from './routes/prediction.routes';
import userRoutes from './routes/user.routes';

// Import middleware
import { authMiddleware, AuthenticatedRequest } from './middleware/authMiddleware';

// Load environment variables from .env file
dotenv.config();

/**
 * EXPRESS SERVER SETUP FOR ESTATEIQ BACKEND
 * 
 * This server provides RESTful API endpoints for the EstateIQ application:
 * - Authentication and user management
 * - Property listings and search
 * - AI price predictions
 * - User profiles and favorites
 * 
 * The server uses:
 * - Express.js for the web framework
 * - Prisma as the ORM for database operations
 * - JWT for authentication
 * - CORS for cross-origin requests from the React frontend
 */

const app = express();

// Middleware Setup

// Enable CORS for all routes - allows React frontend to make requests
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:5174',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ], // Allow requests from various frontend ports
  credentials: true // Allow cookies and authorization headers
}));

// Parse JSON request bodies - allows Express to understand JSON data sent from frontend
app.use(express.json({ limit: '10mb' })); // Increased limit for potential image uploads

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Server port configuration
const port: number = parseInt(process.env.PORT || '3001', 10);

// API Routes

// Simple JWT authentication routes - main authentication system
app.use('/api/auth', simpleAuthRoutes);

// Property routes - handle property listings, search, CRUD operations
app.use('/api/properties', propertiesRoutes);

// Prediction routes - handle AI price predictions and market analysis
app.use('/api/predict', predictionRoutes);

// User routes - handle user profiles, favorites, settings
app.use('/api/users', userRoutes);

// Health check endpoint - useful for monitoring and deployment
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'EstateIQ Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Legacy profile endpoint (keeping for backward compatibility)
// TODO: Move this to user routes once frontend is updated
app.get('/api/my-profile', authMiddleware as any, (req: any, res: Response): any => {
  // If authMiddleware calls next(), we reach here.
  if (!req.user) {
    // This case should ideally be caught by authMiddleware, but as a safeguard:
    return res.status(403).json({ 
      success: false,
      message: 'User information not found after token verification.' 
    });
  }
  
  // Send back user information from the token
  // Note: In production, you might want to fetch fresh user data from DB
  res.json({ 
    success: true,
    message: 'Access granted to your profile.',
    userDataFromToken: req.user 
  });
});

// Catch-all route for unmatched API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/profile',
        'PUT /api/auth/profile',
        'POST /api/auth/logout',
        'GET /api/auth/verify'
      ],
      properties: [
        'GET /api/properties',
        'GET /api/properties/:id',
        'POST /api/properties/search-by-area'
      ],
      predictions: [
        'POST /api/predict/price',
        'GET /api/predict/factors',
        'GET /api/predict/market-trends'
      ],
      users: [
        'GET /api/users/profile',
        'PUT /api/users/profile',
        'GET /api/users/favorites'
      ]
    }
  });
});

// Global error handling middleware
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start the server
app.listen(port, () => {
  console.log(`
  🚀 EstateIQ Backend Server Running!
  
  Port: ${port}
  Environment: ${process.env.NODE_ENV || 'development'}
  Database: ${process.env.DB_URL ? 'Connected' : 'Not configured'}
  Auth: Simple JWT (No Passport.js)
  
  Available endpoints:
  🔐 Auth: http://localhost:${port}/api/auth
  🏠 Properties: http://localhost:${port}/api/properties  
  🤖 Predictions: http://localhost:${port}/api/predict
  👤 Users: http://localhost:${port}/api/users
  ❤️ Health: http://localhost:${port}/api/health
  
  Frontend should connect to: http://localhost:${port}
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});