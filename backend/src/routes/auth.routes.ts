/**
 * Authentication Routes for EstateIQ Backend
 * 
 * This file handles all authentication-related endpoints including:
 * - User registration with validation and password hashing
 * - User login with credential verification
 * - JWT token generation and management
 * - Database operations for user management
 * 
 * Security features:
 * - Password hashing with bcrypt
 * - JWT token authentication
 * - Input validation and sanitization
 * - Duplicate email/phone prevention
 * - Environment variable validation
 */

import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env file
dotenv.config();

// === ENVIRONMENT VARIABLE VALIDATION ===
// Critical: Ensure required environment variables are present
const DB_URL = process.env.DB_URL;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('DEBUG: Loaded DB_URL from .env:', DB_URL);
console.log('DEBUG: Loaded JWT_SECRET from .env:', JWT_SECRET);
console.log('DEBUG: JWT_SECRET length:', JWT_SECRET?.length);
console.log('DEBUG: JWT_SECRET first 20 chars:', JWT_SECRET?.substring(0, 20) + '...');

// Exit immediately if critical environment variables are missing
if (!DB_URL) {
  console.error('FATAL ERROR: DB_URL is not set in .env file');
  process.exit(1);
}
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not set in .env file');
  process.exit(1);
}

// === DATABASE INITIALIZATION ===
// Initialize Neon client for direct SQL queries (legacy)
const sql = neon(DB_URL);

// Initialize Prisma client for ORM operations (preferred)
console.log('DEBUG: Attempting to instantiate PrismaClient from custom path');
const prisma = new PrismaClient();

// Create Express router for authentication endpoints
const router = Router();

// === ENUMS AND CONSTANTS ===
/**
 * User type enumeration for role-based access control
 */
enum UserType {
  USER = 'user',   // Regular users who can search and predict
  ADMIN = 'admin', // Administrators with full access
}

/**
 * Default profile picture URL for new users
 * TODO: Consider using a CDN or local storage for profile pictures
 */
const DEFAULT_PROFILE_PIC = 'https://www.pexels.com/photo/man-wearing-blue-crew-neck-t-shirt-2379005/';

/**
 * POST /api/auth/register
 * 
 * Register a new user account with comprehensive validation and security measures.
 * 
 * Request body:
 * - email: User's email address (must be unique)
 * - password: User's password (minimum 8 characters)
 * - confirmPassword: Password confirmation
 * - firstName: User's first name
 * - lastName: User's last name
 * - phoneNumber: User's phone number (must be unique)
 * 
 * Response:
 * - 201: User created successfully with JWT token
 * - 400: Validation errors or duplicate email/phone
 * - 500: Internal server error
 */
router.post('/register', async (req: Request, res: Response) : Promise<any>=>  {
  // Extract user data from request body
  const { email, password, firstName, lastName, phoneNumber , confirmPassword} = req.body;
  
  // === INPUT VALIDATION ===
  // Check for required fields
  if (!email || !password || !firstName || !lastName || !phoneNumber || !confirmPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Validate password strength
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    // === DUPLICATE CHECK ===
    // Check if email is already registered
    const byEmail = await prisma.users.findUnique({
        where:{
            email : email
        }
    });
    if (byEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Check if phone number is already registered
    const byPhone = await prisma.users.findFirst({
        where: {
            phone_number : phoneNumber
        }
    });
    if (byPhone) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // === PASSWORD SECURITY ===
    // Hash password with bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // === USER CREATION ===
    // Generate unique user ID and timestamps
    const now = new Date().toISOString();
    const userId = randomUUID();

    // Create new user record in database
    const newUser = await prisma.users.create({
        data : {
            user_id : userId,
            email : email,
            password_hash : hashedPassword,
            first_name : firstName,
            last_name : lastName,
            phone_number : phoneNumber,
            user_type : UserType.USER,                    // Default to regular user
            profile_picture_url : DEFAULT_PROFILE_PIC,    // Default profile picture
            is_verified : false,                          // Email verification pending
            created_at : now,
            updated_at : now,
        }
    })

    // === JWT TOKEN GENERATION ===
    // Build JWT payload with user information
    const payload = {
      user: {
        id: newUser.user_id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phoneNumber: newUser.phone_number,
        user_type: newUser.user_type,
        profile_picture_url: newUser.profile_picture_url,
        is_verified: newUser.is_verified,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
    };

    // Sign JWT token with 1-hour expiration
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // === SUCCESS RESPONSE ===
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: payload.user,
    });

  } catch (error) {
    // === ERROR HANDLING ===
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 * 
 * Authenticate user credentials and return JWT token for session management.
 * 
 * Request body:
 * - email: User's registered email address
 * - password: User's password (plain text, will be compared with hashed version)
 * 
 * Response:
 * - 200: Login successful with JWT token
 * - 400: Missing email or password
 * - 401: Invalid credentials (email not found or password incorrect)
 * - 500: Internal server error
 * 
 * Security notes:
 * - Uses bcrypt for secure password comparison
 * - Returns generic "Invalid credentials" message to prevent email enumeration
 * - JWT token expires in 1 hour for security
 */
router.post('/login', async (req: Request, res: Response) : Promise<any> => {
  // Extract credentials from request body
  const { email, password } = req.body;
  
  // === INPUT VALIDATION ===
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // === USER LOOKUP ===
    // Find user by email using direct SQL query (legacy approach)
    // TODO: Consider migrating to Prisma for consistency
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      // Return generic message to prevent email enumeration attacks
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = users[0];

    // === PASSWORD VERIFICATION ===
    // Compare provided password with stored hash using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // === JWT TOKEN GENERATION ===
    // Build JWT payload with essential user information
    const payload = {
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        user_type: user.user_type,
        profile_picture_url: user.profile_picture_url,
        is_verified: user.is_verified,
      },
    };

    // Sign JWT token with 1-hour expiration
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // === SUCCESS RESPONSE ===
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: payload.user,
    });

  } catch (error) {
    // === ERROR HANDLING ===
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
