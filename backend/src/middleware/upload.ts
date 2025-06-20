import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Используем абсолютный путь к папке uploads
    const uploadsPath = path.join(__dirname, '../../uploads');
    console.log('🔧 [DEBUG] Upload destination:', uploadsPath);
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('🔧 [DEBUG] Generated filename:', filename);
    cb(null, filename);
  }
});

// Функция для проверки типа файла
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Разрешенные типы файлов
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла. Разрешены только JPEG, PNG и WebP'));
  }
};

// Настройка multer для загрузки до 10 файлов
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB максимум на файл
    files: 10 // максимум 10 файлов
  }
});

// Middleware для обработки ошибок загрузки
export const handleUploadError = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'Размер файла превышает 5MB' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Максимальное количество файлов: 10' 
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Неожиданное поле файла' 
      });
    }
  }
  
  if (error.message.includes('Неподдерживаемый тип файла')) {
    return res.status(400).json({ 
      error: error.message 
    });
  }
  
  next(error);
}; 