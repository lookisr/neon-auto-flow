import mongoose from 'mongoose';
import { Advertisement } from '../src/models/Advertisement.js';
import { User } from '../src/models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kps-auto';

async function seedData() {
  try {
    console.log('🔧 [DEBUG] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Удаляем существующие данные
    await User.deleteMany({});
    await Advertisement.deleteMany({});
    console.log('✅ Cleared existing data');

    // Создаем тестового пользователя (пароль будет хеширован в модели)
    const testUser = new User({
      email: 'test@example.com',
      password: 'test123'
    });
    await testUser.save();
    console.log('✅ Test user created:', testUser.email);

    // Создаем админа
    const adminUser = new User({
      email: 'company@kps-auto.ru',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Admin user created:', adminUser.email);

    // Создаем тестовые объявления
    const testAdvertisements = [
      {
        userId: testUser._id,
        brand: 'Toyota',
        carModel: 'Camry',
        year: 2020,
        price: 2500000,
        description: 'Отличное состояние, полный пакет документов',
        contacts: '+7 (999) 123-45-67',
        photoUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        engineVolume: 2.5,
        mileage: 50000,
        ownersCount: 1,
        isDamaged: false,
        transmission: 'Автомат',
        fuelType: 'Бензин',
        color: 'Белый'
      },
      {
        userId: testUser._id,
        brand: 'Hyundai',
        carModel: 'Sonata',
        year: 2019,
        price: 1800000,
        description: 'Низкий пробег, один владелец',
        contacts: '+7 (999) 123-45-67',
        photoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
        engineVolume: 2.0,
        mileage: 35000,
        ownersCount: 1,
        isDamaged: false,
        transmission: 'Автомат',
        fuelType: 'Бензин',
        color: 'Серебристый'
      },
      {
        userId: testUser._id,
        brand: 'Kia',
        carModel: 'K5',
        year: 2021,
        price: 2200000,
        description: 'Современный дизайн, экономичный двигатель',
        contacts: '+7 (999) 123-45-67',
        photoUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
        engineVolume: 1.6,
        mileage: 25000,
        ownersCount: 1,
        isDamaged: false,
        transmission: 'Автомат',
        fuelType: 'Бензин',
        color: 'Черный'
      }
    ];

    for (const adData of testAdvertisements) {
      const advertisement = new Advertisement(adData);
      await advertisement.save();
      console.log('✅ Advertisement created:', `${adData.brand} ${adData.carModel}`);
    }

    console.log('✅ Seed data completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed data error:', error);
    process.exit(1);
  }
}

seedData(); 