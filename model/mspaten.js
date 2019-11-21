const Sequelize = require('sequelize');
const sequelize = require('../lib/connection');

const mspaten = sequelize.define("mspaten", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    judul: {
        type: Sequelize.STRING,
    },
    abstrak: {
        type: Sequelize.STRING
    },
    gambar: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    jenis_paten: {
		type: Sequelize.INTEGER
    },
    unit_kerja: {
		type: Sequelize.STRING
    },
    bidang_invensi: {
		type: Sequelize.STRING
	},
    jumlah_klaim : {
        type: Sequelize.INTEGER,
    },
    pemeriksa_paten: {
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
    nomor_permohonan: {
        type: Sequelize.STRING,
    },
    sertifikasi: {
        type: Sequelize.STRING,
    },
    filling: {
        type: Sequelize.DATE,
    },
    formalitas: {
        type: Sequelize.DATE,
    },
    publish: {
        type: Sequelize.DATE,
    },
    pemberian: {
        type: Sequelize.DATE,
    },
    pembayaran: {
        type: Sequelize.DATE,
    },
    nomor_paten: {
        type: Sequelize.STRING,
    },
    tahun_granted: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.INTEGER,
    },
    pernah_diajukan: {
        type: Sequelize.INTEGER,
    },
    tindak_lanjut: {
        type: Sequelize.INTEGER,
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
// mspaten.sync({ force: true }).then(() => {
    // Table created
    // return mspaten.create({
    //     name: 'admin',
    //     password: 'admin',
    //     email : 'imamsatrianta@gmail.com'
    // });
// });
module.exports = mspaten;

