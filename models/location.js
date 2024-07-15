import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  image_url: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'locations',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'modify_time'
});

export default Location;