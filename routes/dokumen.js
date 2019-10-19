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

    Joi.validate(payload, validate)
        .then(validated => {
            try {
                try {
                    const Dokumen = DokumenSchema.create(payload);
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



module.exports = router;
