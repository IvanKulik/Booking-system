const express = require('express');
const router = express.Router();
const bookingRoutes = require('./bookingRoutes');
const eventRoutes = require('./eventRoutes');

// Подключение маршрутов
router.use('/bookings', bookingRoutes);
router.use('/events', eventRoutes);

module.exports = router;
