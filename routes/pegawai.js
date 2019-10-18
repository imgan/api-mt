require("dotenv").config();

const express = require('express');
const PegawaiSchema = require('../model/mspegawai');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

/* GET users listing. */
router.post('/', checkAuth, function (req, res, next) {
    PegawaiSchema.findAndCountAll()
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

router.get('/getpegawai/:id', checkAuth, function (req, res, next) {
    PegawaiSchema.findByPk(req.params.id)
        .then(result =>
          res.status(200).json({
              result,
              id
          })
          
        )
        .catch(err =>
          handleError(err)
        )
});

router.put('/updatepegawai/:id', checkAuth, function (req, res, next) {
    PegawaiSchema.update({
        kode_kepegawaian: req.body.kode_kepegawaian,
        nama :  req.body.nama,
        nik : req.body.nik
    },{
        where:{
            id: req.params.id
        }
    }).then(data => {
        console.log(req.params.id);
        res.status(200).json({
            message: 'Update Successfuly',
            data : data
        });
    })
})

router.post('/addpegawai', checkAuth, async function (req, res, next) {
    let validate = Joi.object().keys({
        kode_kepegawaian: Joi.string().required(),
        nik: Joi.string().required(),
        nama: Joi.string().required(),
    });

    let payload = {
        kode_kepegawaian: req.body.kode_kepegawaian,
        nik: req.body.nik,
        nama: req.body.nama,
    }

    Joi.validate(payload, validate)
        .then(validated => {
            try {
                const {
                    nama,
                    kode_kepegawaian,
                    nik,
                } = req.body;
                try {
                    const pegawai = PegawaiSchema.create({
                        nama,
                        kode_kepegawaian,
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
