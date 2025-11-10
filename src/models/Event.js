const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Модель мероприятия
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Уникальный идентификатор мероприятия'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    },
    comment: 'Название мероприятия'
  },
  total_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      isInt: true
    },
    comment: 'Общее количество мест на мероприятии'
  }
}, {
  tableName: 'events',
  timestamps: false,
  indexes: [
    {
      fields: ['name']
    }
  ]
});

module.exports = Event;
