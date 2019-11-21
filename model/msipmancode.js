const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const msipmancode = sequelize.define("msipmancode", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  kode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  id_jenis: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  jenis_ki: {
    type: Sequelize.STRING
  },
  no_urut: {
    type: Sequelize.INTEGER
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
}  ,
{
    freezeTableName: true,
});

// force: true will drop the table if it already exists
// msipmancode.sync({ force: false }).then(() => {
// Table created
// return mspaten.create({
//     name: 'admin',
//     password: 'admin',
//     email : 'imamsatrianta@gmail.com'
// });
// });

module.exports = msipmancode;

