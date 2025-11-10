const sequelize = require('../config/database');
const Event = require('./Event');
const Booking = require('./Booking');

// Определение связей между моделями
Event.hasMany(Booking, {
  foreignKey: 'event_id',
  as: 'bookings',
  onDelete: 'CASCADE'
});

Booking.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event'
});

module.exports = {
  sequelize,
  Event,
  Booking
};
