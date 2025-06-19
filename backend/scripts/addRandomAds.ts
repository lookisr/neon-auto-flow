import mongoose from 'mongoose';
import { Advertisement } from '../src/models/Advertisement.ts';
import { User } from '../src/models/User.ts';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kps-auto';

// Данные для генерации случайных объявлений
const brands = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'Lexus', 'Infiniti', 'Acura', 'Daihatsu'];
const models = {
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Avalon', 'Tacoma', 'Tundra'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Insight', 'Ridgeline'],
  'Nissan': ['Altima', 'Sentra', 'Rogue', 'Murano', 'Pathfinder', 'Maxima', 'Frontier'],
  'Mazda': ['CX-5', 'CX-9', 'Mazda3', 'Mazda6', 'MX-5', 'CX-30'],
  'Subaru': ['Outback', 'Forester', 'Impreza', 'Legacy', 'Crosstrek', 'Ascent'],
  'Mitsubishi': ['Outlander', 'Eclipse Cross', 'Lancer', 'Pajero', 'ASX'],
  'Lexus': ['ES', 'IS', 'RX', 'NX', 'LS', 'GS', 'LC'],
  'Infiniti': ['Q50', 'Q60', 'QX50', 'QX60', 'QX80'],
  'Acura': ['TLX', 'RDX', 'MDX', 'ILX', 'NSX'],
  'Daihatsu': ['Terios', 'Mira', 'Move', 'Cast', 'Tanto']
};

const transmissions = ['manual', 'automatic', 'robot', 'variator'];
const fuelTypes = ['gasoline', 'diesel', 'hybrid', 'electric', 'lpg'];
const colors = ['Белый', 'Черный', 'Серебристый', 'Серый', 'Красный', 'Синий', 'Зеленый', 'Желтый', 'Оранжевый', 'Фиолетовый'];

const descriptions = [
  'Отличное состояние, полный пакет документов, сервисная книжка',
  'Низкий пробег, один владелец, без ДТП',
  'Современный дизайн, экономичный двигатель, комфортный салон',
  'Надежный автомобиль для семьи, просторный багажник',
  'Спортивный характер, динамичная езда, стильный дизайн',
  'Экономичный расход топлива, идеально для города',
  'Комфортная езда, тихая работа двигателя, качественные материалы',
  'Безопасность превыше всего, современные системы помощи',
  'Практичный выбор, низкие расходы на обслуживание',
  'Премиум качество, роскошный интерьер, передовые технологии'
];

const companyContacts = [
  'Автосалон "Японские автомобили" +7 (495) 123-45-67',
  'ООО "АвтоТрейд" +7 (495) 234-56-78',
  'ИП Иванов А.В. +7 (495) 345-67-89',
  'Автоцентр "Престиж" +7 (495) 456-78-90',
  'ООО "АвтоМир" +7 (495) 567-89-01'
];

const privateContacts = [
  'Александр +7 (999) 111-22-33',
  'Мария +7 (999) 222-33-44',
  'Дмитрий +7 (999) 333-44-55',
  'Елена +7 (999) 444-55-66',
  'Сергей +7 (999) 555-66-77',
  'Анна +7 (999) 666-77-88',
  'Михаил +7 (999) 777-88-99',
  'Ольга +7 (999) 888-99-00'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

async function addRandomAds() {
  try {
    console.log('🔧 [DEBUG] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Очищаем коллекции пользователей и объявлений
    await User.deleteMany({});
    await Advertisement.deleteMany({});
    console.log('✅ Cleared existing users and advertisements');

    // Получаем существующих пользователей или создаем новых
    let users = await User.find({});
    
    if (users.length === 0) {
      console.log('⚠️ No users found, creating test users...');
      const testUsers = [
        new User({ email: 'company1@example.com', password: 'password123', role: 'admin' }),
        new User({ email: 'company2@example.com', password: 'password123', role: 'admin' }),
        new User({ email: 'user1@example.com', password: 'password123', role: 'user' }),
        new User({ email: 'user2@example.com', password: 'password123', role: 'user' }),
        new User({ email: 'user3@example.com', password: 'password123', role: 'user' })
      ];
      
      for (const user of testUsers) {
        await user.save();
      }
      users = await User.find({});
    }

    // Разделяем пользователей по ролям
    const companyUsers = users.filter(u => u.role === 'admin');
    const privateUsers = users.filter(u => u.role === 'user');

    console.log(`✅ Found ${users.length} users`);

    // Создаем 20 случайных объявлений (10 от частных лиц, 10 от компаний)
    const advertisements: any[] = [];

    // Создаём по 10 объявлений для каждого статуса
    const statuses = ['approved', 'pending', 'rejected'];
    for (const status of statuses) {
      for (let i = 0; i < 5; i++) { // 5 от компаний
        const brand = getRandomElement(brands);
        const model = getRandomElement(models[brand as keyof typeof models]);
        const year = getRandomNumber(2015, 2024);
        const price = getRandomNumber(800000, 5000000);
        const engineVolume = getRandomFloat(1.0, 4.0);
        const mileage = getRandomNumber(10000, 150000);
        const ownersCount = getRandomNumber(1, 3);
        const isDamaged = Math.random() < 0.15;
        const transmission = getRandomElement(transmissions);
        const fuelType = getRandomElement(fuelTypes);
        const color = getRandomElement(colors);
        const description = getRandomElement(descriptions);
        const contacts = getRandomElement(companyContacts);
        const user = getRandomElement(companyUsers);
        const advertisement = new Advertisement({
          userId: user._id,
          brand,
          carModel: model,
          year,
          price,
          description,
          contacts,
          photoUrls: ['/placeholder.svg'],
          engineVolume,
          mileage,
          ownersCount,
          isDamaged,
          transmission,
          fuelType,
          color,
          status,
          moderationNote: status === 'rejected' ? 'Не соответствует требованиям площадки' : undefined,
          moderatedBy: status !== 'pending' ? user._id : undefined,
          moderatedAt: status !== 'pending' ? new Date() : undefined
        });
        advertisements.push(advertisement);
      }
      for (let i = 0; i < 5; i++) { // 5 от частников
        const brand = getRandomElement(brands);
        const model = getRandomElement(models[brand as keyof typeof models]);
        const year = getRandomNumber(2015, 2024);
        const price = getRandomNumber(800000, 5000000);
        const engineVolume = getRandomFloat(1.0, 4.0);
        const mileage = getRandomNumber(10000, 150000);
        const ownersCount = getRandomNumber(1, 3);
        const isDamaged = Math.random() < 0.15;
        const transmission = getRandomElement(transmissions);
        const fuelType = getRandomElement(fuelTypes);
        const color = getRandomElement(colors);
        const description = getRandomElement(descriptions);
        const contacts = getRandomElement(privateContacts);
        const user = getRandomElement(privateUsers);
        const advertisement = new Advertisement({
          userId: user._id,
          brand,
          carModel: model,
          year,
          price,
          description,
          contacts,
          photoUrls: ['/placeholder.svg'],
          engineVolume,
          mileage,
          ownersCount,
          isDamaged,
          transmission,
          fuelType,
          color,
          status,
          moderationNote: status === 'rejected' ? 'Не соответствует требованиям площадки' : undefined,
          moderatedBy: status !== 'pending' ? user._id : undefined,
          moderatedAt: status !== 'pending' ? new Date() : undefined
        });
        advertisements.push(advertisement);
      }
    }

    // Сохраняем все объявления
    for (const ad of advertisements) {
      await ad.save();
      console.log(`✅ Advertisement created: ${ad.brand} ${ad.carModel} (${ad.status}) - ${ad.contacts}`);
    }

    console.log('✅ Successfully added 20 random advertisements');
    console.log(`📊 Statistics:`);
    console.log(`   - Total ads: ${advertisements.length}`);
    console.log(`   - Approved: ${advertisements.filter((ad: any) => ad.status === 'approved').length}`);
    console.log(`   - Pending: ${advertisements.filter((ad: any) => ad.status === 'pending').length}`);
    console.log(`   - Rejected: ${advertisements.filter((ad: any) => ad.status === 'rejected').length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding random ads:', error);
    process.exit(1);
  }
}

addRandomAds(); 