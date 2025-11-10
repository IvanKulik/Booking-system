const bookingService = require('../services/bookingService');

class BookingController {
  /**
   * POST /api/bookings/reserve
   */
  async reserve(req, res, next) {
    try {
      const { event_id, user_id } = req.body;

      // Валидация входных данных
      if (!event_id || !user_id) {
        return res.status(400).json({
          success: false,
          error: 'Отсутствуют обязательные поля event_id и user_id'
        });
      }

      // Валидация типов данных
      if (typeof event_id !== 'number' || typeof user_id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Неверные типы данных'
        });
      }

      const booking = await bookingService.createBooking(event_id, user_id);

      res.status(201).json({
        success: true,
        message: 'Бронирование успешно создано',
        data: booking
      });
    } catch (error) {

      if (error.message === 'EVENT_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: 'Мероприятие не найдено'
        });
      }

      if (error.message === 'DUPLICATE_BOOKING') {
        return res.status(400).json({
          success: false,
          error: 'Вы уже забронировали место на это мероприятие'
        });
      }

      if (error.message === 'NO_SEATS_AVAILABLE') {
        return res.status(400).json({
          success: false,
          error: 'Нет доступных мест на это мероприятие'
        });
      }

      next(error);
    }
  }

  /**
   * GET /api/bookings
   */
  async getAll(req, res, next) {
    try {
      const filters = {
        event_id: req.query.event_id ? parseInt(req.query.event_id) : undefined,
        user_id: req.query.user_id
      };

      const bookings = await bookingService.getAllBookings(filters);

      res.status(200).json({
        success: true,
        data: bookings,
        count: bookings.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bookings/:id
   */
  async getId(req, res, next) {
    try {
      const bookingId = parseInt(req.params.id);

      if (isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный ID бронирования'
        });
      }

      const booking = await bookingService.getBookingById(bookingId);

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Бронирование не найдено'
        });
      }

      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
