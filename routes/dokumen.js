require("dotenv").config();

const express = require('express');
const DokumenSchema = require('../model/msdokumen');
const checkAuth = require('../middleware/check-auth');
const Joi = require('joi');

const router = express.Router();

router.post('/adddokumen', checkAuth, async function (req, res, next) {
    let validate = Joi.object().keys({
        nomor_pendaftar: Joi.string().required(),
        name: Joi.string().required(),
        size: Joi.string().required(),
        type: Joi.string().required(),
        role: Joi.string().required(),
        jenis_dokumen: Joi.string().required(),
        tgl_input: Joi.string().required(),
        kode_input: Joi.string().required(),
        downloadable: Joi.string().required(),
    });

    let payload = {
        nomor_pendaftar: req.body.nomor_pendaftar,
        name: req.body.name,
        downloadable: req.body.downloadable,
        size: req.body.size,
        role: req.body.role,
        jenis_dokumen: req.body.jenis_dokumen,
        tgl_input: req.body.tgl_input,
        kode_input: req.body.kode_input,
        type: req.body.type,
    }

    let schema = {
        nomor_pendaftar: req.body.nomor_pendaftar,
        name: req.body.name,
        downloadable: req.body.downloadable,
        size: req.body.size,
        role: req.body.role,
        jenis_dokumen: req.body.jenis_dokumen,
        tgl_input: req.body.tgl_input,
        kode_input: req.body.kode_input,
        type: req.body.type,
        dokumen: req.body.dokumen
    }

    Joi.validate(payload, validate)
        .then(validated => {
            try {
                try {
                    const Dokumen = DokumenSchema.create(schema);
                    if (Dokumen) {
                        res.status(201).json({
                            status: 201,
                            messages: 'Dokumen berhasil ditambahkan',
                            data: payload,
                        })
                    }

                } catch (error) {
                    res.status(400).json({
                        'status': 'ERROR',
                        'messages': error.message,
                        'data': {},
                    })
                }
            }
            catch (err) {
                res.status(400).json({
                    'status': 'ERROR',
                    'messages': err.message,
                    'data': {},
                })
            }
        })
});


router.post('/getdokumenbyipman', checkAuth, function (req, res, next) {
    let validate = Joi.object().keys({
        code: Joi.string().required(),
    });

    const payload = {
        code: req.body.code,
    }

    Joi.validate(payload, validate, (error) => {
        DokumenSchema.sequelize.query({
            query: "SELECT " +
                "a.id," +
                "a.nomor_pendaftar," +
                "a.name," +
                "a.size," +
                "a.rev," +
                "a.role," +
                "a.rev," +
                "a.downloadable, " +
                "a.tgl_input, " +
                "a.kode_input, " +
                "a.tgl_ubah, " +
                "a.kode_ubah, " +
                "x.* " +
                "FROM msdokumen a " +
                "JOIN msjenisdokumen x ON a.jenis_dokumen = x.id " +
                "WHERE a.nomor_pendaftar = '" + req.body.code + "' AND a.role = 1 " +
                "GROUP BY a.jenis_dokumen",
        }).then((data) => {
            if (data.length < 1) {
                res.status(404).json({
                    message: 'Not Found',
                });
            }
            else {
                res.status(200).json({
                    data
                })
            }
        })
        if (error) {
            res.status(400).json({
                'status': 'ERROR',
                'messages': error.message,
            })
        }
    });
})

router.post('/deletedokumenbynomorpendaftar', checkAuth, function (req, res, next) {
    let validate = Joi.object().keys({
        code: Joi.string().required(),
    });

    const payload = {
        code: req.body.code,
    }
    // console.log(payload.code);
    Joi.validate(payload, validate, (error) => {
        DokumenSchema.destroy({
            where:{
                nomor_pendaftar: req.body.code,
                role : 2
            }
        }).then(data => {
            res.status(200).json({
                message: 'Delete Successfuly',
                data
            });
        })
        if(error){
            res.status(400).json({
                'status': 'ERROR',
                'messages': error.message,
            })
        }
})
})

router.post('/fgetdokumenbyipman', checkAuth, function (req, res, next) {
    let validate = Joi.object().keys({
        code: Joi.string().required(),
    });

    const payload = {
        code: req.body.code,
    }

    Joi.validate(payload, validate, (error) => {
        DokumenSchema.sequelize.query({
            query: "SELECT " +
                "a.id," +
                "a.nomor_pendaftar," +
                "a.name," +
                "a.size," +
                "a.rev," +
                "a.role," +
                "a.rev," +
                "a.downloadable, " +
                "a.tgl_input, " +
                "a.kode_input, " +
                "a.tgl_ubah, " +
                "a.kode_ubah " +
                "FROM msdokumen a " +
                "WHERE a.nomor_pendaftar = '" + req.body.code + "' AND a.role = 1 " 
        }).then((data) => {
            if (data.length < 1) {
                res.status(404).json({
                    message: 'Not Found',
                });
            }
            else {
                res.status(200).json({
                    data
                })
            }
        })
        if (error) {
            res.status(400).json({
                'status': 'ERROR',
                'messages': error.message,
            })
        }
    });
})

module.exports = router;
