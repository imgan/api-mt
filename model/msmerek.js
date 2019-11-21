const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const msmerek = sequelize.define("msmerek", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    judul: {
        type: Sequelize.STRING,
    },
    kelas: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    unit_kerja: {
		type: Sequelize.STRING
    },
    jumlah_klaim : {
        type: Sequelize.INTEGER,
    },
    pemeriksa_merek: {
        type: Sequelize.STRING,
    },
    kontak_pemeriksa: {
        type: Sequelize.STRING,
    },
    email_pemeriksa : {
        type: Sequelize.STRING,
    },
    no_handphone : {
        type: Sequelize.STRING,
    },
    ipman_code: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.INTEGER,
    },
    pernah_diajukan: {
        type: Sequelize.INTEGER,
    },
    sertifikasi: {
        type: Sequelize.DATE,
    },
    tahun_pendaftaran: {
        type: Sequelize.STRING,
    },
    tahun_granted: {
        type: Sequelize.STRING,
    },
    nomor_pendaftar: {
        type: Sequelize.STRING,
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
// msmerek.sync({ force: true }).then(() => {
    // Table created
    // return mspaten.create({
    //     name: 'admin',
    //     password: 'admin',
    //     email : 'imamsatrianta@gmail.com'
    // });
// });
module.exports = msmerek;

