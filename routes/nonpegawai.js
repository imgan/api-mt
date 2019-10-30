require("dotenv").config();

const express = require('express');
const NonpegawaiSchema = require('../model/msnonpegawai');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

/* GET users listing. */
router.post('/', checkAuth, function (req, res, next) {
    NonpegawaiSchema.findAndCountAll()
        .then((data) => {
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
            // });x
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
                status: 500
            });
        });
});

router.post('/insertpendesain', checkAuth, async function (req, res, next) {
    let validate = Joi.object().keys({
        nik: Joi.string().required(),
        nama: Joi.string().required(),
    });

    let payload = {
        nik: req.body.nik,
        nama: req.body.nama,
    }

    Joi.validate(payload, validate)
        .then(validated => {
            try {
                const {
                    nama,
                    nik,
                } = req.body;
                try {
                    const pegawai = NonpegawaiSchema.create({
                        nama,
                        nik,
                    });
                    if (pegawai) {
                        res.status(201).json({
                            status: 200,
                            messages: 'User berhasil ditambahkan',
                            data: pegawai,
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
