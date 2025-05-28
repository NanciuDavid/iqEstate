import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error('DB_URL is not set');
}
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

// Initialize Neon client
const sql = neon(DB_URL);

// User types
enum UserType {
  USER = 'user',
  ADMIN = 'admin',
}

// Default profile picture
const DEFAULT_PROFILE_PIC = 'https://www.pexels.com/photo/man-wearing-blue-crew-neck-t-shirt-2379005/';

// POST /register
router.post('/register', async (req: Request, res: Response) : Promise<any>=>  {
  const { email, password, firstName, lastName, phoneNumber } = req.body;
  
  // Basic validation
  if (!email || !password || !firstName || !lastName || !phoneNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    // Check for existing email or phone
    const [byEmail] = await sql`SELECT user_id FROM users WHERE email = ${email}`;
    if (byEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const [byPhone] = await sql`SELECT user_id FROM users WHERE phone_number = ${phoneNumber}`;
    if (byPhone) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const userId = randomUUID();

    // Insert user
    const [newUser] = await sql`
      INSERT INTO users
        (user_id, email, password_hash, first_name, last_name, phone_number,
         created_at, updated_at, user_type, profile_picture_url, is_verified)
      VALUES
        (${userId}, ${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${phoneNumber},
         ${now}, ${now}, ${UserType.USER}, ${DEFAULT_PROFILE_PIC}, ${false})
      RETURNING *
    `;

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
