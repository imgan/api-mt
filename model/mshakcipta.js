const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const mshakcipta = sequelize.define("mshakcipta", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    judul: {
        type: Sequelize.STRING,
    },
    object: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    unit_kerja: {
		type: Sequelize.INTEGER
    },
    no_handphone : {
        type: Sequelize.STRING,
    },
    ipman_code: {
        type: Sequelize.STRING,
    },
    nomor_pencatat: {
        type: Sequelize.STRING,
    },
    nomor_hakcipta: {
        type: Sequelize.STRING,
    },
    sertifikasi: {
        type: Sequelize.DATE,
    },
    pemeriksa_hakcipta: {
        type: Sequelize.STRING,
    },
    kontak_pemeriksa: {
        type: Sequelize.STRING,
    },
    email_pemeriksa: {
        type: Sequelize.STRING,
    },
    tgl_permohonan: {
        type: Sequelize.DATE,
    },
    tgl_publish: {
        type: Sequelize.DATE,
    },
    lokasi: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.INTEGER,
    },
    pernah_diajukan: {
        type: Sequelize.INTEGER,
    },
    keterangan: {
        type: Sequelize.STRING,
    },
    index: {
        type: Sequelize.STRING,
    },
    tgl_input: {
        type: Sequelize.DATE,
    },
    kode_input: {
        type: Sequelize.STRING,
    },
    tgl_ubah: {
        type: Sequelize.DATE,
    },
    kode_ubah: {
        type: Sequelize.STRING,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}  ,
{
    freezeTableName: true,
});

// force: true will drop the table if it already exists
// mshakcipta.sync({ force: true }).then(() => {
    // Table created
    // return mspaten.create({
    //     name: 'admin',
    //     password: 'admin',
    //     email : 'imamsatrianta@gmail.com'
    // });
// });
module.exports = mshakcipta;

