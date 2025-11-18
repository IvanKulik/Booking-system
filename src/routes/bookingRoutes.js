const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/bookings/reserve - Забронировать место
router.post('/reserve', bookingController.reserve.bind(bookingController));

// GET /api/bookings - Получить все бронирования
router.get('/', bookingController.getAll.bind(bookingController));

// GET /api/bookings/:id - Получить бронирование по ID
router.get('/:id', bookingController.getId.bind(bookingController));

// GET /api/bookings/:place - Получить топ 10 бронирования
router.get('/:place', bookingController.getTop.bind(bookingController));

module.exports = router;
