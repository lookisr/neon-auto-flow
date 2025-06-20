# КПС-АВТО

Платформа для покупки и продажи автомобилей с системой модерации объявлений.

## Описание

КПС-АВТО - это современная платформа для покупки и продажи автомобилей, которая предоставляет пользователям удобный интерфейс для размещения объявлений, поиска автомобилей и взаимодействия с продавцами.

## Основные возможности

- 🚗 **Объявления автомобилей** - размещение и просмотр объявлений
- 🔍 **Поиск и фильтрация** - поиск по марке, модели, цене
- 🛡️ **Система модерации** - проверка объявлений модераторами
- 📸 **Загрузка фотографий** - до 10 фото на объявление
- 📊 **Интеграция с Google Sheets** - отправка заявок
- 🔐 **Аутентификация** - регистрация и авторизация пользователей
- 📱 **Адаптивный дизайн** - работает на всех устройствах

## Технологии

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - стилизация
- **Vite** - сборщик
- **React Router** - маршрутизация
- **Axios** - HTTP клиент

### Backend
- **Node.js** - среда выполнения
- **Express.js** - веб-фреймворк
- **TypeScript** - типизированный JavaScript
- **MongoDB** - база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - аутентификация
- **Cloudinary** - хранение изображений
- **Google APIs** - интеграция с Google Sheets

## Установка и запуск

### Предварительные требования

- Node.js 18+
- MongoDB
- Cloudinary аккаунт
- Google Cloud Project с API ключами

### Клонирование репозитория

```bash
git clone <repository-url>
cd kps-auto
```

### Backend

```bash
cd backend
npm install
```

Создайте файл `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kps-auto
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GOOGLE_SHEETS_PRIVATE_KEY=your-private-key
GOOGLE_SHEETS_CLIENT_EMAIL=your-client-email
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
```

Запуск:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Запуск:

```bash
npm run dev
```

## Структура проекта

```
kps-auto/
├── backend/          # Backend API (Node.js + Express)
├── frontend/         # Frontend (React + TypeScript)
├── README.md         # Основная документация
└── package.json      # Корневой package.json
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Профиль пользователя

### Объявления
- `GET /api/advertisements` - Все объявления
- `POST /api/advertisements` - Создание объявления
- `GET /api/advertisements/:id` - Объявление по ID
- `PUT /api/advertisements/:id` - Обновление
- `DELETE /api/advertisements/:id` - Удаление

### Модерация
- `GET /api/advertisements/pending` - На модерации
- `POST /api/advertisements/:id/moderate` - Модерация

### Формы
- `POST /api/forms/korea-import` - Импорт из Кореи
- `POST /api/forms/consultation` - Консультация

## Разработка

### Скрипты

**Backend:**
- `npm run dev` - Разработка
- `npm run build` - Сборка
- `npm start` - Продакшн
- `npm run seed` - Тестовые данные

**Frontend:**
- `npm run dev` - Разработка
- `npm run build` - Сборка
- `npm run preview` - Предпросмотр

### Линтинг

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Лицензия

MIT
