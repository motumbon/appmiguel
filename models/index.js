const sequelize = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const Visit = require('./Visit');

// Relaciones
User.hasMany(Company, { foreignKey: 'userId', onDelete: 'CASCADE' });
Company.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Visit, { foreignKey: 'userId', onDelete: 'CASCADE' });
Visit.belongsTo(User, { foreignKey: 'userId' });

Company.hasMany(Visit, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Visit.belongsTo(Company, { foreignKey: 'companyId' });

module.exports = { sequelize, User, Company, Visit };
