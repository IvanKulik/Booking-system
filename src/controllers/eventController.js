const eventService = require('../services/eventService');

class EventController {
  /**
   * GET /api/events/:id
   */
  async getId(req, res, next) {
    try {
      const eventId = parseInt(req.params.id);

      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный ID мероприятия'
        });
      }

      const event = await eventService.getEventId(eventId);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Мероприятие не найдено'
        });
      }

      res.status(200).json({
        success: true,
        data: event
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/events
   */
  async getAll(req, res, next) {
    try {
      const events = await eventService.getAllEvents();

      res.status(200).json({
        success: true,
        data: events,
        count: events.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/events
   */
  async create(req, res, next) {
    try {
      const { name, total_seats } = req.body;

      const event = await eventService.createEvent({ name, total_seats });

      res.status(201).json({
        success: true,
        message: 'Мероприятие успешно создано',
        data: event
      });
    } catch (error) {
      if (error.message === 'INVALID_SEAT_COUNT') {
        return res.status(400).json({
          success: false,
          error: 'Количество мест должно быть не менее 1'
        });
      }

      next(error);
    }
  }
}

module.exports = new EventController();
