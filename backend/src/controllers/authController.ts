import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthRequest } from '../types/index';

dotenv.config();

function generateToken(user: { _id: string; email: string }) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
}

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🔧 [DEBUG] Registration attempt for email:', req.body.email);
      const { email, password } = req.body;
      const user = await userService.createUser(email, password);
      const token = generateToken({ _id: user._id.toString(), email: user.email });
      console.log('🔧 [DEBUG] User registered successfully:', user.email);
      res.status(201).json({
        success: true,
        data: {
          user: { id: user._id.toString(), email: user.email, role: user.role, createdAt: user.createdAt },
          token
        }
      });
    } catch (err) {
      console.error('🔧 [DEBUG] Registration error:', err);
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🔧 [DEBUG] Login attempt for email:', req.body.email);
      const { email, password } = req.body;
      
      if (!email || !password) {
        console.log('🔧 [DEBUG] Missing email or password');
        return res.status(400).json({ 
          success: false, 
          message: 'Email and password are required' 
        });
      }

      const user = await userService.findUserByEmail(email);
      console.log('🔧 [DEBUG] User found:', !!user);
      
      if (!user) {
        console.log('🔧 [DEBUG] User not found for email:', email);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      const isPasswordValid = await userService.comparePassword(user, password);
      console.log('🔧 [DEBUG] Password validation result:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('🔧 [DEBUG] Invalid password for user:', email);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      const token = generateToken({ _id: user._id.toString(), email: user.email });
      console.log('🔧 [DEBUG] Login successful for user:', email);
      
      res.json({
        success: true,
        data: {
          user: { id: user._id.toString(), email: user.email, role: user.role, createdAt: user.createdAt },
          token
        }
      });
    } catch (err) {
      console.error('🔧 [DEBUG] Login error:', err);
      next(err);
    }
  },

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      res.json({
        success: true,
        data: {
          user: { id: user.id, email: user.email, role: user.role }
        }
      });
    } catch (err) {
      next(err);
    }
  }
}; 