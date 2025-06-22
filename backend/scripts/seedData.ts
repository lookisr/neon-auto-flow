import mongoose from 'mongoose';
import { User } from '../src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neon-auto-flow';

async function seedData() {
  try {
    console.log('🔧 [DEBUG] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Удаляем пользователя с таким email, если есть
    await User.deleteMany({ email: 'company@kps-auto.ru' });

    // Создаем админа
    const adminUser = new User({
      email: 'company@kps-auto.ru',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Admin user created:', adminUser.email);

    console.log('✅ Seed data completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed data error:', error);
    process.exit(1);
  }
}

seedData(); 