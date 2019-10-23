const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const msdokumen = sequelize.define("msdokumen", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nomor_pendaftar: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
  },
  dokumen: {
    type: Sequelize.BLOB,
  },
  size: {
    type: Sequelize.FLOAT
  },
  type: {
    type: Sequelize.STRING
  },
  rev: {
    type: Sequelize.INTEGER
  },
  role: {
    type: Sequelize.INTEGER
  },
  jenis_dokumen: {
    type: Sequelize.INTEGER
  },
  downloadable: {
    type: Sequelize.INTEGER
  },
  tgl_input: {
    type: Sequelize.DATE
  },
  kode_input: {
    type: Sequelize.STRING
  },
  kode_ubah: {
    type: Sequelize.INTEGER
  },
  tgl_ubah: {
    type: Sequelize.DATE
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

// force: true will drop the table if it already exists
// msdokumen.sync({ force: true }).then(() => {
// Table created
// return mspaten.create({
//     name: 'admin',
//     password: 'admin',
//     email : 'imamsatrianta@gmail.com'
// });
// });
module.exports = msdokumen;

