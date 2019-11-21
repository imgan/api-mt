require("dotenv").config();

const express = require('express');
const PembayaranSchema = require('../model/trpembayaran');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

/* GET users listing. */
router.post('/addpembayaran', checkAuth, function (req, res, next) {

    var base64Data = req.body.dokumen;

    require("fs").writeFileSync(`./public/file/${req.body.name}`, base64Data, 'base64', function (error, data) {
      console.log('File Berhasil Di generate');
    });
    
    let validate = Joi.object().keys({
        nomor_pendaftar: Joi.string().required(),
        tgl_input: Joi.date().required(),
        jenis_pembayaran: Joi.string().required(),
        bukti_pembayaran: Joi.string().required(),
        pembayaran: Joi.string().required(),
    });

    let payload = {
        nomor_pendaftar: req.body.nomor_pendaftar,
        tgl_input: req.body.tgl_input,
        jenis_pembayaran: req.body.jenis_pembayaran,
        bukti_pembayaran: req.body.bukti_pembayaran,
        pembayaran: req.body.pembayaran,
    }  
    Joi.validate(payload, validate, (error) => {
        try {
          const paten = PembayaranSchema.create(payload)
            .then(result => res.status(201).json({
              status: 201,
              messages: 'Pembayaran berhasil ditambahkan',
            }));
        } catch (error) {
          res.status(400).json({
            'status': 'ERROR',
            'messages': error,
          })
        }
        if (error) {
          res.status(400).json({
            messages: error.message
          })
        }
      })

});

router.post('/getpembayaran', checkAuth, function (req, res, next) {
    PembayaranSchema.sequelize.query('SELECT tr.*,msp.unit_kerja,msr.nama_rev as unit ' +
        'FROM trpembayaran tr ' +
        'JOIN mspaten msp ON tr.nomor_pendaftar = msp.nomor_permohonan ' +
        'JOIN msrev msr ON msp.unit_kerja = msr.id ' +
        'UNION ' +
        'SELECT tr.*,msm.unit_kerja,msr.nama_rev as unit ' +
        'FROM trpembayaran tr ' +
        'JOIN msmerek msm ON tr.nomor_pendaftar = msm.nomor_pendaftar ' +
        'JOIN msrev msr ON msm.unit_kerja = msr.id ')
        .then(data => {
            res.status(200).json({
                message: 'success',
                data
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
                status: 500
            });
        });
});

router.post('/getdetail', checkAuth, function (req, res, next) {
    let validate = {
        nomor_paten: Joi.string().required(),
    }
    let payload = {
        nomor_paten: req.body.nomor_paten
    }

    Joi.validate(payload, validate, (error) => {
        PembayaranSchema.sequelize.query('SELECT `mspaten`.*,`msrev`.`nama_rev` ' +
            'FROM `mspaten` ' +
            'JOIN `msrev` ON `mspaten`.`UNIT_KERJA` = `msrev`.`ID` ' +
            'WHERE `mspaten`.`id` = ' + req.body.nomor_paten + ' ')
            .then(data => {
                res.status(200).json({
                    message: 'success',
                    data
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: 500
                });
            });
    })

});


module.exports = router;
