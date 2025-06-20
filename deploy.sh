#!/bin/bash
set -e

# Установка зависимостей
npm install
cd backend && npm install && cd ..

# Сборка проектов
npm run build
cd backend && npm run build && cd ..

# Установка serve, если не установлен
if ! command -v serve &> /dev/null; then
  npm install -g serve
fi

# Запуск через pm2
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi
pm2 start ecosystem.config.js
pm2 save

echo "\n---\nДеплой завершён!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:8080" 