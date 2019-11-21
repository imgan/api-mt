const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const mspegawai = sequelize.define("mspegawai", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    kode_kepegawaian: {
        type: Sequelize.STRING,
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
// mspegawai.sync({ force: false }).then(() => {
    // Table created
    // return mspaten.create({
    //     name: 'admin',
    //     password: 'admin',
    //     email : 'imamsatrianta@gmail.com'
    // });
// });
module.exports = mspegawai;

