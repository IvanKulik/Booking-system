const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Модель бронирования
const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Уникальный идентификатор бронирования'
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id'
    },
    comment: 'Внешний ключ на таблицу events'
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Идентификатор пользователя, создавшего бронь'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    comment: 'Время создания бронирования'
  }
}, {
  tableName: 'bookings',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['event_id', 'user_id'],
      name: 'unique_user_event_booking'
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['event_id']
    }
  ]
});

module.exports = Booking;
