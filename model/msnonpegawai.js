const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const msnonpegawai = sequelize.define("msnonpegawai", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nik: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nama: {
		type: Sequelize.STRING
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}  ,
{
    freezeTableName: true,
});

// force: true will drop the table if it already exists
// msnonpegawai.sync({ force: false }).then(() => {
    // Table created
    // return mspaten.create({
    //     name: 'admin',
    //     password: 'admin',
    //     email : 'imamsatrianta@gmail.com'
    // });
// });
module.exports = msnonpegawai;

