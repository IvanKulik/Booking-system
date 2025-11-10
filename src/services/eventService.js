const { Event, Booking } = require('../models');

class EventService {
  /**
   * Получить мероприятие по ID со статистикой бронирований
   * @param {number} eventId - ID мероприятия
   * @returns {Promise<Object|null>} Мероприятие с информацией о бронированиях или null
   */
  async getEventId(eventId) {
    const event = await Event.findByPk(eventId);
    
    if (!event) {
      return null;
    }

    const bookedCount = await Booking.count({
      where: { event_id: eventId }
    });

    return {
      id: event.id,
      name: event.name,
      total_seats: event.total_seats,
      booked_seats: bookedCount,
      free_seats: event.total_seats - bookedCount
    };
  }

  /**
   * Получить все мероприятия со статистикой бронирований
   * @returns {Promise<Array>} Список мероприятий с информацией о бронированиях
   */
  async getAllEvents() {
    const events = await Event.findAll();
    
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const bookedCount = await Booking.count({
          where: { event_id: event.id }
        });

        return {
          id: event.id,
          name: event.name,
          total_seats: event.total_seats,
          booked_seats: bookedCount,
          free_seats: event.total_seats - bookedCount
        };
      })
    );

    return eventsWithStats;
  }

  /**
   * Создать новое мероприятие
   * @param {Object} eventData - Данные мероприятия (name, total_seats)
   * @returns {Promise<Object>} Созданное мероприятие
   */
  async createEvent(eventData) {
    const { name, total_seats } = eventData;

    if (!name || !total_seats) {
      throw new Error('MISSING_REQUIRED_FIELDS');
    }

    if (total_seats < 1) {
      throw new Error('INVALID_SEAT_COUNT');
    }

    const event = await Event.create({
      name,
      total_seats
    });

    return event;
  }

  /**
   * Проверить, есть ли доступные места на мероприятии
   * @param {number} eventId - ID мероприятия
   * @returns {Promise<boolean>} True если места доступны
   */
  async hasAvailableSeats(eventId) {
    const event = await Event.findByPk(eventId);
    
    if (!event) {
      return false;
    }

    const bookedCount = await Booking.count({
      where: { event_id: eventId }
    });

    return bookedCount < event.total_seats;
  }
}

module.exports = new EventService();
