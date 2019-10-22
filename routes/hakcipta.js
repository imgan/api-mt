require("dotenv").config();

const express = require('express');
const hakciptaSchema = require('../model/mshakcipta');
const dhakciptaSchema = require('../model/msdhakcipta');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

/* GET users listing. */
router.post('/gethakcipta', checkAuth, function (req, res, next) {
  hakciptaSchema.findAndCountAll()
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


router.post('/addhakcipta', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    unit_kerja: Joi.number().required(),
    status: Joi.number().required(),
    object: Joi.number().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_input: Joi.string().required(),
  });

  let payload = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input,
    object: req.body.object,
  }

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = hakciptaSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Hak Cipta berhasil ditambahkan',
          id: result.id,
        }));
    } catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error,
        'data': {},
      })
    }
    if (error) {
      res.status(400).json({
        messages: error.message
      })
    }
  })
});

router.post('/adddhakcipta', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    id_hakcipta: Joi.number().required(),
    nik: Joi.number().required(),
  });

  let payload = {
    id_hakcipta: req.body.id_hakcipta,
    nik: req.body.nik,
  }

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = dhakciptaSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Hak Cipta berhasil ditambahkan',
          id: result.id,
        }));
    } catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error,
        'data': {},
      })
    }
    if (error) {
      res.status(400).json({
        messages: error.message
      })
    }
  })
});
module.exports = router;
