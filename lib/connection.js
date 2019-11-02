const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
  host: '192.168.1.5',
  dialect: 'mysql',
  //   operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
