const { Booking, Event, sequelize } = require('../models');
const { Op } = require('sequelize');

class BookingService {
  /**
   * Создать новое бронирование для пользователя
   * @param {number} eventId - ID мероприятия
   * @param {string} userId - ID пользователя
   * @returns {Promise<Object>} Созданное бронирование
   * @throws {Error} Если валидация не прошла или бронирование не может быть создано
   */
  async createBooking(eventId, userId) {
    // Используем транзакцию для обеспечения целостности данных
    const transaction = await sequelize.transaction();

    try {
      // Проверяем существование мероприятия
      const event = await Event.findByPk(eventId, { transaction });
      if (!event) {
        throw new Error('EVENT_NOT_FOUND');
      }

      // Проверяем, нет ли уже бронирования у пользователя на это мероприятие
      const existingBooking = await Booking.findOne({
        where: {
          event_id: eventId,
          user_id: userId
        },
        transaction
      });

      if (existingBooking) {
        throw new Error('DUPLICATE_BOOKING');
      }

      // Проверяем доступность мест
      const bookedCount = await Booking.count({
        where: { event_id: eventId },
        transaction
      });

      if (bookedCount >= event.total_seats) {
        throw new Error('NO_SEATS_AVAILABLE');
      }

      // Создаем бронирование
      const booking = await Booking.create({
        event_id: eventId,
        user_id: userId,
        created_at: new Date()
      }, { transaction });

      await transaction.commit();

      return {
        id: booking.id,
        event_id: booking.event_id,
        user_id: booking.user_id,
        created_at: booking.created_at
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Получить все бронирования с опциональными фильтрами
   * @param {Object} filters - Опциональные фильтры (event_id, user_id)
   * @returns {Promise<Array>} Список бронирований
   */
  async getAllBookings(filters = {}) {
    const where = {};
    
    if (filters.event_id) {
      where.event_id = filters.event_id;
    }
    
    if (filters.user_id) {
      where.user_id = filters.user_id;
    }

    return await Booking.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Получить бронирование по ID
   * @param {number} bookingId - ID бронирования
   * @returns {Promise<Object|null>} Бронирование или null если не найдено
   */
  async getBookingId(bookingId) {
    return await Booking.findByPk(bookingId);
  }

  /**
   * Получение даты начала фильтрации
   * @param {Date} startPeriod 
   * @returns {Promise<Date||null>}
   */
  async getStartDate(startPeriod) {
      const nowDate = new Date();
      let startDate;

      switch (startPeriod) {
          case 'day':
              startDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDay());
              break;
          case 'week':
              startDate = new Date(nowDate.setDate(nowDate.getDate() - nowDate.getDay()));
              startDate.setHours(0, 0, 0, 0);
              break;
          case 'month':
              startDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
              break;
          default:
              return null;
      }
      return startDate;
  };

  /**
   * Проверить, есть ли у пользователя бронирование на мероприятие
   * @param {number} eventId - ID мероприятия
   * @param {string} userId - ID пользователя
   * @returns {Promise<boolean>} True если бронирование существует
   */
  async hasUserBooking(eventId, userId) {
    const booking = await Booking.findOne({
      where: {
        event_id: eventId,
        user_id: userId
      }
    });
    return !!booking;
  }
}

module.exports = new BookingService();
