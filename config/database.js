const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    },
    logging: false
  });
} else {
  try {
    require('sqlite3');
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'database.sqlite'),
      logging: false
    });
  } catch (e) {
    console.error('No se encontró DATABASE_URL ni sqlite3. Configure DATABASE_URL para usar PostgreSQL.');
    process.exit(1);
  }
}

module.exports = sequelize;
