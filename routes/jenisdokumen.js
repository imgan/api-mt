require("dotenv").config();

const express = require('express');
const DokumenSchema = require('../model/msjenisdokumen');
const checkAuth = require('../middleware/check-auth');
const Joi = require('joi');

const router = express.Router();

/* GET listing. */
router.post('/getnewdokver', checkAuth, function (req, res, next) {
    let validate = Joi.object().keys({
        id_role: Joi.number().required(),
    });

    let payload = {
        id_role: req.body.id_role,
    }
    Joi.validate(payload,validate, (error) => {
            DokumenSchema.findAndCountAll({
                where: {
                    id_role: req.body.id_role
                }
            })
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
                })
                .catch((err) => {
                    res.status(500).json({
                        error: err,
                        status: 500
                    });
                });
                if(error){
                    res.status(400).json({
                        error: error.message,
                        status: 400
                    });
        }
    })

});

router.post('/getjenisdokumen', checkAuth, function (req, res, next) {
    if (req.body.id_haki && req.body.id_role === undefined  ) {
        DokumenSchema.findAndCountAll({
            where: {
                id_haki: req.body.id_haki
            }
        })
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
            })
            .catch((err) => {
                res.status(500).json({
                    error: err,
                    status: 500
                });
            });
    } else if (req.body.id_haki && req.body.id_role) {
        DokumenSchema.findAndCountAll({
            where: {
                id_haki: req.body.id_haki,
                id_role: req.body.id_role
            }
        })
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
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: 500
                });
            });
    } else if (req.body.id_role && req.body.id_haki === undefined) {

        DokumenSchema.findAndCountAll({
            where: {
                id_role: req.body.id_role
            }
        })
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
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: 500
                });
            });
    } else {
        console.log(req.body.id_haki)
        console.log(req.body.id_role)

        DokumenSchema.findAndCountAll()
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
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: 500
                });
            });
    }
});

router.post('/addjenisdokumen', checkAuth, async function (req, res, next) {
    let validate = Joi.object().keys({
        id_haki: Joi.string().required(),
        id_role: Joi.string().required(),
        jenis_dokumen: Joi.string().required(),
        penamaan_file: Joi.string().required(),
        downloadable: Joi.string().required(),
    });

    let payload = {
        jenis_dokumen: req.body.jenis_dokumen,
        penamaan_file: req.body.penamaan_file,
        downloadable: req.body.downloadable,
        id_haki: req.body.id_haki,
        id_role: req.body.id_role,
    }

    Joi.validate(payload, validate)
        .then(validated => {
            try {
                const {
                    jenis_dokumen,
                    penamaan_file,
                    downloadable,
                    id_haki,
                    id_role
                } = req.body;
                try {
                    const jenisdokumen = DokumenSchema.create({
                        jenis_dokumen,
                        penamaan_file,
                        downloadable,
                        id_haki,
                        id_role
                    });
                    if (jenisdokumen) {
                        res.status(201).json({
                            status: 201,
                            messages: 'Dokumen berhasil ditambahkan',
                            data: jenisdokumen,
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
