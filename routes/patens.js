require("dotenv").config();

const express = require('express');
const sequelize = require('sequelize');
const PatenSchema = require('../model/mspaten');
const DokumenSchema = require('../model/msdokumen');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    if (file.mimetype === 'text/plain') {
      filetype = 'txt';
    }
    cb(null, 'file-' + Date.now() + '.' + filetype);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

/* GET users listing. */
router.post('/getpaten', checkAuth, function (req, res, next) {
  PatenSchema.findAndCountAll()
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

router.post('/getpatenbyyear', checkAuth, function (req, res, next) {
  PatenSchema.sequelize.query('SELECT * FROM (SELECT YEAR(TGL_INPUT) as tahun,count(*) as total ' +
    'FROM mspatens GROUP BY YEAR(TGL_INPUT) DESC LIMIT 5)as paten ORDER BY tahun ASC')
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({
          message: 'Not Found',
        });
      }
      else {
        // console.log(data[0][0].tahun)
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
});

router.post('/getpatendiajukan', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    userId: Joi.string().required()
  });

  let payload = {
    userId: req.body.userId,
  }
  const userId = req.body.userId

  PatenSchema.sequelize.query('SELECT a.judul,a.id,a.createdAt,b.keterangan,b.NAMA_REV FROM msrevs b JOIN mspatens a ON b.ID = a.UNIT_KERJA WHERE a.status = 19 AND a.KODE_INPUT = ' + userId + ' ')
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({
          message: 'Not Found',
        });
      }
      else {
        // console.log(data[0][0].tahun)
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
});

router.post('/getpatendraft', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    userId: Joi.number().required(),
    role_id: Joi.number().required()
  });

  let payload = {
    userId: req.body.userId,
    role_id: req.body.role_id,

  }
  const userId = req.body.userId;
  const role_id = req.body.role_id;
  if (role_id === 18) {
    PatenSchema.sequelize.query('SELECT a.judul,a.id,a.createdAt,b.keterangan,b.NAMA_REV FROM msrevs b LEFT JOIN mspatens a ON b.ID = a.UNIT_KERJA WHERE a.status = 19 AND a.KODE_INPUT = ' + userId + ' ')
      .then((data) => {
        if (data.length < 1) {
          res.status(404).json({
            message: 'Not Found',
          });
        }
        else {
          // console.log(data[0][0].tahun)
          res.status(200).json({
            data,
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
    PatenSchema.sequelize.query('SELECT a.judul,a.id,a.createdAt,b.keterangan,b.NAMA_REV FROM msrevs b LEFT JOIN mspatens a ON b.ID = a.UNIT_KERJA WHERE a.status = 19')
      .then((data) => {
        if (data.length < 1) {
          res.status(404).json({
            message: 'Not Found',
          });
        }
        else {
          // console.log(data[0][0].tahun)
          res.status(200).json({
            data,
            role_id

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

router.post('/addpaten', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    jenis_paten: Joi.string().required(),
    unit_kerja: Joi.string().required(),
    bidang_invensi: Joi.string().required(),
    status: Joi.string().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_input: Joi.string().required(),
  });

  let payload = {
    judul: req.body.judul,
    jenis_paten: req.body.jenis_paten,
    unit_kerja: req.body.unit_kerja,
    bidang_invensi: req.body.bidang_invensi,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input
  }

  Joi.validate(payload, validate)
    .then(validated => {
      try {
        const schema = {
          judul,
          jenis_paten,
          unit_kerja,
          abstrak,
          gambar,
          bidang_invensi,
          status,
          no_handphone,
          ipman_code,
          kode_input
        } = req.body;
        try {
          const paten = PatenSchema.create(schema)
            .then(result => res.status(201).json({
              status: 201,
              messages: 'Paten berhasil ditambahkan',
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

router.post('/adddokumen', checkAuth, function (req, res, next) {
  try {
    try {
      const schema = {
        nomor_pendaftar: req.body.nomor_pendaftar,
        dokumen: req.body.dokumen,
        name: req.body.name,
        type: req.body.type,
        role: req.body.role,
        jenis_dokumen: req.body.jenis_dokumen,
        downloadable: req.body.downloadable
      }
      const paten = DokumenSchema.create(schema)
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
  }
  catch (err) {
    res.status(400).json({
      'status': 'ERROR',
      'messages': err.message,
      'data': {},
    })
  }
});

module.exports = router;
