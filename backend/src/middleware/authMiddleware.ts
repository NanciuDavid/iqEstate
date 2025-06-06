// my-new-react-app/backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'; // Ensure NextFunction is here
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthenticatedRequest extends Request {
  user?: any; 
}

// Explicitly type the return for clarity, though Express middleware often relies on side effects (res.send or next())
export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return; // Return after sending response
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set. Cannot verify token.');
    res.status(500).json({ message: 'Server configuration error.' });
    return; // Return after sending response
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired.' });
      return; // Return
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: 'Invalid token.' });
      return; // Return
    }
    res.status(403).json({ message: 'Token verification failed.' });
    return; // Return
  }
};