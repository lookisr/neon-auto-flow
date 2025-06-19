import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes';
import advertisementRoutes from './routes/advertisementRoutes';
import formRoutes from './routes/formRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080', 
  'http://localhost:8081',
  'http://localhost:8082'
];

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:8080';
console.log('[CORS] Allowing origins:', corsOrigin);

// Улучшенные CORS настройки
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🔧 [DEBUG] CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Обработка OPTIONS запросов
app.options('*', cors());

// Middleware для логирования всех запросов
app.use((req, res, next) => {
  console.log('🔧 [DEBUG] Incoming request:', req.method, req.path);
  console.log('🔧 [DEBUG] Content-Type:', req.headers['content-type']);
  console.log('🔧 [DEBUG] Raw body length:', req.headers['content-length']);
  console.log('🔧 [DEBUG] Origin:', req.headers['origin']);
  next();
});

app.use(express.json());

// Middleware для логирования после парсинга JSON
app.use((req, res, next) => {
  if (req.path.includes('/login') || req.path.includes('/register')) {
    console.log('🔧 [DEBUG] After JSON parsing - Request body:', req.body);
  }
  next();
});

const uploadsPath = path.join(process.cwd(), 'backend/uploads');
console.log('[DEBUG] Static uploads path:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Логирование запросов к статическим файлам
app.use('/uploads', (req, res, next) => {
  console.log('🔧 [DEBUG] Static file request:', req.method, req.path);
  next();
});

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use('/api', authRoutes);
app.use('/api', advertisementRoutes);
app.use('/api', formRoutes);

app.use(errorHandler);

export default app; 