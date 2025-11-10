const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /api/events - Получить все мероприятия
router.get('/', eventController.getAll.bind(eventController));

// GET /api/events/:id - Получить мероприятие по ID
router.get('/:id', eventController.getId.bind(eventController));

// POST /api/events - Создать новое мероприятие
router.post('/', eventController.create.bind(eventController));

module.exports = router;
