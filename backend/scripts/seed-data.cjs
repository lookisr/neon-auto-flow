const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auto-flow');

// Импорт моделей
const { User } = require('../dist/models/User');
const { Advertisement } = require('../dist/models/Advertisement');

async function seedData() {
  try {
    console.log('Начинаем заполнение базы данных...');

    // Очистка существующих данных
    await User.deleteMany({});
    await Advertisement.deleteMany({});

    // Создание тестового пользователя
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123',
    });
    await testUser.save();
    console.log('Создан тестовый пользователь:', testUser.email);

    // Создание пользователя-компании (админа)
    const companyUser = new User({
      email: 'company@kps-auto.ru',
      password: 'admin123',
    });
    await companyUser.save();
    console.log('Создан пользователь-компания:', companyUser.email);

    // Создание тестовых объявлений от компании
    const companyAds = [
      {
        brand: 'Toyota',
        carModel: 'Camry',
        year: 2020,
        price: 2350000,
        description: 'Отличное состояние, полная комплектация, один владелец',
        contacts: '+7 (999) 123-45-67',
        photoUrls: ['http://localhost:8800/uploads/placeholder.svg'],
        engineVolume: 2.5,
        mileage: 45000,
        ownersCount: 1,
        isDamaged: false,
        transmission: 'automatic',
        fuelType: 'gasoline',
        color: 'Белый',
        userId: companyUser._id
      },
      {
        brand: 'Hyundai',
        carModel: 'Sonata',
        year: 2019,
        price: 1890000,
        description: 'Комфортный седан, экономичный расход, сервисная история',
        contacts: '+7 (999) 234-56-78',
        photoUrls: ['http://localhost:8800/uploads/placeholder.svg'],
        engineVolume: 2.0,
        mileage: 78000,
        ownersCount: 2,
        isDamaged: false,
        transmission: 'automatic',
        fuelType: 'gasoline',
        color: 'Серебристый',
        userId: companyUser._id
      },
      {
        brand: 'Kia',
        carModel: 'Optima',
        year: 2021,
        price: 2650000,
        description: 'Новый автомобиль, гарантия, все документы',
        contacts: '+7 (999) 345-67-89',
        photoUrls: ['http://localhost:8800/uploads/placeholder.svg'],
        engineVolume: 2.0,
        mileage: 15000,
        ownersCount: 1,
        isDamaged: false,
        transmission: 'automatic',
        fuelType: 'gasoline',
        color: 'Черный',
        userId: companyUser._id
      },
    ];

    for (const adData of companyAds) {
      const ad = new Advertisement(adData);
      await ad.save();
      console.log('Создано объявление от компании:', adData.brand, adData.carModel);
    }

    // Создание тестовых объявлений от пользователей
    const userAds = [
      {
        brand: 'Honda',
        carModel: 'Accord',
        year: 2018,
        price: 1750000,
        description: 'Хорошее состояние, регулярное ТО, не битый',
        contacts: '+7 (999) 456-78-90',
        photoUrls: ['http://localhost:8800/uploads/placeholder.svg'],
        engineVolume: 1.8,
        mileage: 95000,
        ownersCount: 2,
        isDamaged: false,
        transmission: 'manual',
        fuelType: 'gasoline',
        color: 'Синий',
        userId: testUser._id,
      },
      {
        brand: 'Mazda',
        carModel: '6',
        year: 2017,
        price: 1540000,
        description: 'Надежный автомобиль, экономичный, в отличном состоянии',
        contacts: '+7 (999) 567-89-01',
        photoUrls: ['http://localhost:8800/uploads/placeholder.svg'],
        engineVolume: 2.0,
        mileage: 120000,
        ownersCount: 3,
        isDamaged: true,
        transmission: 'manual',
        fuelType: 'gasoline',
        color: 'Красный',
        userId: testUser._id,
      },
    ];

    for (const adData of userAds) {
      const ad = new Advertisement(adData);
      await ad.save();
      console.log('Создано объявление от пользователя:', adData.brand, adData.carModel);
    }

    console.log('База данных успешно заполнена!');
    console.log('Тестовый пользователь: test@example.com / password123');
    console.log('Создано объявлений от компании:', companyAds.length);
    console.log('Создано объявлений от пользователей:', userAds.length);

  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedData(); 