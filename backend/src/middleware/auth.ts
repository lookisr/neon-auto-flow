import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { AuthRequest } from '../types/index.js';
import { User } from '../models/User.js';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback-secret';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    (req as AuthRequest).user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  await authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    const authReq = req as AuthRequest;
    if (authReq.user?.role !== 'admin' && authReq.user?.role !== 'moderator') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin or moderator access required' 
      });
    }
    
    next();
  });
};

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { id: userId, email },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
}; 