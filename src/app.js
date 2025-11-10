
const express = require('express');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const requestLogger = require('./middleware/requestLogger');

const app = express();

// Middleware для парсинга JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов (только в режиме разработки)
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// API маршруты
app.use('/api', routes);

// Обработчик 404 ошибки
app.use(notFound);

// Глобальный обработчик ошибок (должен быть последним)
app.use(errorHandler);

module.exports = app;
