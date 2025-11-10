const app = require('./app');
const { sequelize } = require('./models');
const config = require('./config/config');
const eventService = require('./services/eventService');

/**
 * Инициализация базы данных и создание тестового мероприятия
 */
async function initializeDatabase() {
  try {
    // Проверка подключения к базе данных
    await sequelize.authenticate();
    console.log('Подключение к базе данных установлено');

    // Синхронизация моделей базы данных
    await sequelize.sync();
    console.log('Модели базы данных синхронизированы');

    // Создание тестового мероприятия, если оно не существует
    const event = await eventService.getEventId(1);

  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    throw error;
  }
}

/**
 * Запуск сервера
 */
async function startServer() {
  try {
    await initializeDatabase();

    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Не удалось запустить сервер:', error);
    process.exit(1);
  }
}

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (err) => {
  console.error('Необработанное отклонение промиса:', err);
  process.exit(1);
});

// Обработка неперехваченных исключений
process.on('uncaughtException', (err) => {
  console.error('Неперехваченное исключение:', err);
  process.exit(1);
});

// Запуск сервера
startServer();