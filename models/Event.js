const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Booking = require('./Booking');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'events', 
  timestamps: false, 
});

// Одно мероприятие может иметь много броней
Event.hasMany(Booking, { foreignKey: 'event_id' });
Booking.belongsTo(Event, { foreignKey: 'event_id' });

module.exports = Event;