require("dotenv").config();

const express = require('express');
const MerekSchema = require('../model/msmerek');
const DmerekSchema = require('../model/msdmerek');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

/* GET users listing. */
router.post('/getmerek', checkAuth, function (req, res, next) {
  MerekSchema.findAndCountAll()
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


router.post('/addmerek', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    unit_kerja: Joi.number().required(),
    status: Joi.number().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_input: Joi.string().required(),
    kelas: Joi.string().required(),
  });

  let payload = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input,
    kelas: req.body.kelas,
  }

  Joi.validate(payload, validate)
    .then(validated => {
      try {
        const schema = {
          judul,
          unit_kerja,
          status,
          no_handphone,
          ipman_code,
          kode_input,
          kelas,
        } = req.body;
        try {
          const paten = MerekSchema.create(schema)
            .then(result => res.status(201).json({
              status: 201,
              messages: 'Merek berhasil ditambahkan',
              id: result.id,
            }));
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

router.post('/adddmerek', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    id_merek: Joi.number().required(),
    nik: Joi.number().required(),
  });

  let payload = {
    id_merek: req.body.id_merek,
    nik: req.body.nik,
  }

  Joi.validate(payload, validate)
    .then(validated => {
      try {
        const schema = {
          id_merek: req.body.id_merek,
          nik: req.body.nik,
        } = req.body;
        try {
          const paten = MerekSchema.create(schema)
            .then(result => res.status(201).json({
              status: 201,
              messages: 'Merek berhasil ditambahkan',
              id: result.id,
            }));
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
