require("dotenv").config();

const express = require('express');
const ipmancodeSchema = require('../../model/msipmancode');
const checkAuth = require('../../middleware/check-auth');


const router = express.Router();

/* GET users listing. */

router.post('/getcodepb', checkAuth, function (req, res, next) {
  ipmancodeSchema.findAndCountAll({
    where: {
      id_jenis: 24
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

router.post('/getcodeps', checkAuth, function (req, res, next) {
  ipmancodeSchema.findAndCountAll({
    where: {
      id_jenis: 25
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

router.post('/addcode', checkAuth, async function (req, res, next) {
  let validate = Joi.object().keys({
    kode: Joi.string().required(),
    id_jenis: Joi.string().required(),
    jenis_kl: Joi.string().required(),
    no_urut: Joi.string().required(),
  });

  let payload = {
    kode: req.body.kode,
    id_jenis: req.body.id_jenis,
    jenis_kl: req.body.jenis_kl,
    no_urut: req.body.no_urut,
  }

  Joi.validate(payload, validate)
    .then(validated => {
      try {
        const {
          no_urut,
          jenis_kl,
          id_jenis,
          kode,
        } = req.body;
        try {
          const code = ipmancodeSchema.create({
            no_urut,
            jenis_kl,
            id_jenis,
            kode,
          });
          if (code) {
            res.status(201).json({
              status: 201,
              messages: 'Kode berhasil ditambahkan',
              data: code,
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
