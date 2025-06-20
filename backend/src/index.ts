import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { connectDB } from './config/database.js';
import formRoutes from './routes/formRoutes.js';
import authRoutes from './routes/authRoutes.js';
import advertisementRoutes from './routes/advertisementRoutes.js';

// Load environment variables
dotenv.config();

console.log('🔧 [DEBUG] Starting server initialization...');
console.log('🔧 [DEBUG] Environment variables loaded');
console.log('🔧 [DEBUG] PORT:', process.env.PORT || 5000);
console.log('🔧 [DEBUG] NODE_ENV:', process.env.NODE_ENV || 'development');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🔧 [DEBUG] Express app created');

// Определяем путь к uploads
const uploadsPath = path.join(process.cwd(), 'uploads');
console.log('🔧 [DEBUG] Working directory:', process.cwd());
console.log('🔧 [DEBUG] Static uploads path:', uploadsPath);

// Проверяем существование директории
if (fs.existsSync(uploadsPath)) {
  console.log('🔧 [DEBUG] Uploads directory exists');
  const files = fs.readdirSync(uploadsPath);
  console.log('🔧 [DEBUG] Files in uploads:', files.length);
  console.log('🔧 [DEBUG] First file:', files[0]);
} else {
  console.log('🔧 [ERROR] Uploads directory not found at:', uploadsPath);
}

// Раздача статики
app.use('/uploads', (req, res, next) => {
  const requestedFile = path.join(uploadsPath, req.path);
  console.log('🔧 [DEBUG] Static request:', {
    method: req.method,
    path: req.path,
    fullPath: requestedFile,
    exists: fs.existsSync(requestedFile)
  });
  next();
}, express.static(uploadsPath));

// Connect to MongoDB
console.log('🔧 [DEBUG] Attempting to connect to MongoDB...');
connectDB();

// Security middleware с настройками для статики
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
console.log('🔧 [DEBUG] Setting up CORS...');
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Compression middleware
console.log('🔧 [DEBUG] Setting up compression...');
app.use(compression());

// Logging middleware
console.log('🔧 [DEBUG] Setting up request logging...');
app.use(morgan('combined'));

// Body parsing middleware
console.log('🔧 [DEBUG] Setting up body parsers...');
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
console.log('🔧 [DEBUG] Setting up health check endpoint...');
app.get('/health', (req, res) => {
  console.log('🔧 [DEBUG] Health check requested');
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
console.log('🔧 [DEBUG] Setting up API routes...');
app.use('/api', formRoutes);
app.use('/api', authRoutes);
app.use('/api', advertisementRoutes);

// 404 handler
console.log('🔧 [DEBUG] Setting up 404 handler...');
app.use('*', (req, res) => {
  console.log('🔧 [DEBUG] 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
console.log('🔧 [DEBUG] Setting up global error handler...');
app.use((error: any, req: any, res: any, next: any) => {
  console.error('🔧 [DEBUG] Global error handler triggered:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Start server
console.log('🔧 [DEBUG] Starting server on port', PORT);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log('🔧 [DEBUG] Server startup complete');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔧 [DEBUG] SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔧 [DEBUG] SIGINT received, shutting down gracefully');
  process.exit(0);
}); 