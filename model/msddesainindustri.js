const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const msddesainindustri = sequelize.define("ddesainindustri", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_desain_industri: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    nik: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}  ,
{
    freezeTableName: true,
});

// force: true will drop the table if it already exists
// msddesainindustri.sync({ force: false }).then(() => {
    // Table created
    // return mspaten.create({
    //     name: 'admin',
    //     password: 'admin',
    //     email : 'imamsatrianta@gmail.com'
    // });
// });
module.exports = msddesainindustri;

