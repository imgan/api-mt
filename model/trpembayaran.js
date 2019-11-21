// const Sequelize = require('sequelize');
// const sequelize = require('../lib/connection');



const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const trpembayaran = sequelize.define("trpembayaran", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nokwitansi: {
        type: Sequelize.STRING,
    },
    nomor_pendaftar: {
        type: Sequelize.STRING,
    },
    kode_tarif: {
        type: Sequelize.STRING,
    },
    jenis_pembayaran: {
		type: Sequelize.STRING
    },
    pembayaran: {
		type: Sequelize.INTEGER
    },
    bukti_pembayaran: {
		type: Sequelize.STRING
	},
    index: {
        type: Sequelize.INTEGER,
    },
    tgl_input: {
        type: Sequelize.DATE,
    },
    kode_input: {
        type: Sequelize.STRING,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}  ,
{
    freezeTableName: true,
});

// force: true will drop the table if it already exists
// trpembayaran.sync({ force: false }).then(() => {
//     // Table created
//     return msuser.create({
//         name: 'admin',
//         password: 'admin',
//         email : 'imamsatrianta@gmail.com'
//     });
// });
module.exports = trpembayaran;

