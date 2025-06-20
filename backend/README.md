# КПС-АВТО Backend (MVP)

Backend API для платформы покупки и продажи автомобилей КПС-АВТО.

## Описание

КПС-АВТО - это платформа для покупки и продажи автомобилей с системой модерации объявлений, интеграцией с Google Sheets для заявок и загрузкой фотографий в Cloudinary.

## Основные возможности

- 🔐 **Аутентификация и авторизация** - JWT токены, роли пользователей (user, moderator, admin)
- 🚗 **Управление объявлениями** - CRUD операции для автомобильных объявлений
- 📸 **Загрузка фотографий** - интеграция с Cloudinary для хранения изображений
- 🛡️ **Система модерации** - проверка и одобрение объявлений модераторами
- 📊 **Интеграция с Google Sheets** - отправка заявок в Google таблицы
- 🔍 **Поиск и фильтрация** - поиск по марке, модели, цене
- 📱 **RESTful API** - полный набор эндпоинтов для frontend

## Технологии

- **Node.js** - среда выполнения
- **Express.js** - веб-фреймворк
- **TypeScript** - типизированный JavaScript
- **MongoDB** - база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - аутентификация
- **Multer** - загрузка файлов
- **Cloudinary** - хранение изображений
- **Google APIs** - интеграция с Google Sheets

## Установка и запуск

### Предварительные требования

- Node.js 18+
- MongoDB
- Cloudinary аккаунт
- Google Cloud Project с API ключами

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Сервер
PORT=5000
NODE_ENV=development

# База данных
MONGODB_URI=mongodb://localhost:27017/kps-auto

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Sheets
GOOGLE_SHEETS_PRIVATE_KEY=your-private-key
GOOGLE_SHEETS_CLIENT_EMAIL=your-client-email
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
```

### Запуск в режиме разработки

```bash
npm run dev
```

### Сборка для продакшена

```bash
npm run build
npm start
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получение информации о текущем пользователе

### Объявления
- `GET /api/advertisements` - Получение всех объявлений
- `POST /api/advertisements` - Создание нового объявления
- `GET /api/advertisements/:id` - Получение объявления по ID
- `PUT /api/advertisements/:id` - Обновление объявления
- `DELETE /api/advertisements/:id` - Удаление объявления

### Модерация
- `GET /api/advertisements/pending` - Получение объявлений на модерации
- `POST /api/advertisements/:id/moderate` - Модерация объявления

### Загрузка файлов
- `POST /api/upload` - Загрузка фотографий

### Google Sheets
- `POST /api/forms/korea-import` - Отправка заявки на импорт из Кореи
- `POST /api/forms/consultation` - Отправка заявки на консультацию

## Структура проекта

```
src/
├── config/          # Конфигурация (база данных, middleware)
├── controllers/     # Контроллеры для обработки запросов
├── middleware/      # Промежуточное ПО (auth, validation)
├── models/          # Mongoose модели
├── routes/          # Маршруты API
├── services/        # Бизнес-логика
├── types/           # TypeScript типы
└── index.ts         # Точка входа
```

## Скрипты

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка проекта
- `npm start` - Запуск в продакшене
- `npm run seed` - Заполнение базы тестовыми данными
- `npm run add-random-ads` - Добавление случайных объявлений

## Лицензия

MIT 