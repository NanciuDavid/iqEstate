import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

// Initialize and check environment variables immediately after dotenv.config()
const DB_URL = process.env.DB_URL;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('DEBUG: Loaded DB_URL from .env:', DB_URL);
console.log('DEBUG: Loaded JWT_SECRET from .env:', JWT_SECRET);

if (!DB_URL) {
  console.error('FATAL ERROR: DB_URL is not set in .env file');
  process.exit(1); // Exit if DB_URL is not set
}
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not set in .env file');
  process.exit(1); // Exit if JWT_SECRET is not set
}

// Initialize Neon client after DB_URL is confirmed
const sql = neon(DB_URL);

console.log('DEBUG: Attempting to instantiate PrismaClient from custom path');
const prisma = new PrismaClient();

const router = Router();

// User types
enum UserType {
  USER = 'user',
  ADMIN = 'admin',
}

// Default profile picture
const DEFAULT_PROFILE_PIC = 'https://www.pexels.com/photo/man-wearing-blue-crew-neck-t-shirt-2379005/';

// POST /register
router.post('/register', async (req: Request, res: Response) : Promise<any>=>  {
  const { email, password, firstName, lastName, phoneNumber , confirmPassword} = req.body;
  
  // Basic validation
  if (!email || !password || !firstName || !lastName || !phoneNumber || !confirmPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }


  try {
    // Check for existing email or phone
    const byEmail = await prisma.users.findUnique({
        where:{
            email : email
        }
    });
    if (byEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const byPhone = await prisma.users.findFirst({
        where: {
            phone_number : phoneNumber
        }
    });
    if (byPhone) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const userId = randomUUID();

    // Insert user
    const newUser = await prisma.users.create({
        data : {
            user_id : userId,
            email : email,
            password_hash : hashedPassword,
            first_name : firstName,
            last_name : lastName,
            phone_number : phoneNumber,
            user_type : UserType.USER,
            profile_picture_url : DEFAULT_PROFILE_PIC,
            is_verified : false,
            created_at : now,
            updated_at : now,
        }
    })

    // Build JWT payload
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

    // Sign token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: payload.user,
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /login
router.post('/login', async (req: Request, res: Response) : Promise<any> => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // Build JWT payload
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

    // Sign token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
