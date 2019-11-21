const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const msjenisdokumen = sequelize.define("msjenisdokumen", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_haki: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  id_role: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  jenis_dokumen: {
    type: Sequelize.STRING
  },
  penamaan_file: {
    type: Sequelize.STRING
  },
  downloadable: {
    type: Sequelize.INTEGER
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
}  ,
{
    freezeTableName: true,
});

// force: true will drop the table if it already exists
// msjenisdokumen.sync({ force: false }).then(() => {
// Table created
// return mspaten.create({
//     name: 'admin',
//     password: 'admin',
//     email : 'imamsatrianta@gmail.com'
// });
// });
module.exports = msjenisdokumen;

