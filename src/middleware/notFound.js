/**
 * Обработчик 404 ошибки
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден',
    path: req.originalUrl
  });
};

module.exports = notFound;
