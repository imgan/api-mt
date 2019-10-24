require("dotenv").config();

const express = require('express');
const ipmancodeSchema = require('../../model/msipmancode');
const DokumenSchema = require('../../model/msdokumen');
const Joi = require('joi');


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


router.post('/getcode', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    kode: Joi.string().required(),
  });

  let payload = {
    kode: req.body.kode,
  }

  Joi.validate(payload, validate, (error) => {
      ipmancodeSchema.findAndCountAll({
        where: {
          kode: req.body.kode,
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
      if (error) {
        res.status(400).json({
          messages: error.message
        })
      }
  })

});

router.post('/updatenourut', checkAuth, async function (req, res, next) {
  ipmancodeSchema.findAll({
    attributes: ['no_urut'],
    where: {
      kode: req.body.kode
    }
  }).then((last_no) => {
    // console.log(last_no[0].no_urut)
    ipmancodeSchema.update({
      no_urut: last_no[0].no_urut + 1,
    }, {
      where: {
        kode: req.body.kode
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
            data,
          })
        }
        // });x
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
          status: 500,
          data: no_urut
        });
      });
  })
});


router.post('/adddokumen', checkAuth, function (req, res, next) {

  let validate = Joi.object().keys({
    nomor_pendaftar: Joi.string().required(),
    // dokumen: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    role: Joi.number().required(),
    jenis_dokumen: Joi.number().required(),
    downloadable: Joi.number().required(),
  });

  const payload = {
    nomor_pendaftar: req.body.nomor_pendaftar,
    // dokumen: req.body.dokumen,
    name: req.body.name,
    type: req.body.type,
    role: req.body.role,
    jenis_dokumen: req.body.jenis_dokumen,
    downloadable: req.body.downloadable
  }
  Joi.validate(payload, validate, (error) => {
    try {
      const paten = DokumenSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Dokumen berhasil ditambahkan',
        }));
    } catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
        'data': {},
      })
    }
    if (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
      })
    }
  })
});
module.exports = router;
