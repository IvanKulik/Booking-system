/**
 * Глобальный обработчик ошибок
 */
const errorHandler = (err, req, res, next) => {
  console.error('Ошибка:', err);

  // Ошибки валидации Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Ошибка валидации',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Ошибки уникальности Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Дублирующаяся запись',
      details: 'Бронирование с такими данными уже существует'
    });
  }

  // Ошибки внешнего ключа Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Неверная ссылка',
      details: 'Указанная сущность не существует'
    });
  }

  // Ошибка сервера по умолчанию
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Что-то пошло не так'
  });
};

module.exports = errorHandler;
