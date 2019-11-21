const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const msdesainindustri = sequelize.define("msdesainindustri", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    judul: {
        type: Sequelize.STRING,
    },
    unit_kerja: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    no_handphone: {
		type: Sequelize.STRING
    },
    ipman_code : {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.INTEGER,
    },
    pernah_diajukan: {
        type: Sequelize.INTEGER,
    },
    tahun_pendaftar : {
        type: Sequelize.STRING,
    },
    tahun_granted : {
        type: Sequelize.STRING,
    },
    sertifikasi: {
        type: Sequelize.DATE,
    },
    pemeriksa_desain: {
        type: Sequelize.STRING,
    },
    kontak_pemeriksa: {
        type: Sequelize.STRING,
    },
    email_pemeriksa: {
        type: Sequelize.STRING,
    },
    nomor_pendaftar: {
        type: Sequelize.STRING,
    },
    nomor_desain: {
        type: Sequelize.STRING,
    },
    keterangan: {
        type: Sequelize.STRING,
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
// msdesainindustri.sync({ force: true }).then(() => {
    // Table created
    // return mspaten.create({
    //     name: 'admin',
    //     password: 'admin',
    //     email : 'imamsatrianta@gmail.com'
    // });
// });
module.exports = msdesainindustri;

