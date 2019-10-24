require("dotenv").config();

const express = require('express');
const sequelize = require('sequelize');
const PatenSchema = require('../model/mspaten');
const dPatenSchema = require('../model/msdpaten');
const pegawaiSchema = require('../model/mspegawai');
const nonpegawaiSchema = require('../model/msnonpegawai');
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
router.post('/getinventor', checkAuth, function (req, res, next) {
  dPatenSchema.sequelize.query('SELECT DISTINCT `dpatens`.*,`mspegawais`.`NIK`,`mspegawais`.`NAMA` FROM `dpatens` JOIN `mspegawais` ON `dpatens`.`NIK` = `mspegawais`.`NIK`')
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

router.post('/getnoninventor', checkAuth, function (req, res, next) {
  dPatenSchema.sequelize.query('SELECT DISTINCT `dpatens`.*,`msnonpegawais`.`NIK`,`msnonpegawais`.`NAMA` FROM `dpatens` JOIN `msnonpegawais` ON `dpatens`.`NIK` = `msnonpegawais`.`NIK`')
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

router.post('/getpaten', checkAuth, function (req, res, next) {
  PatenSchema.findAndCountAll({
    attributes: {
      exclude: ['gambar', 'abstrak']
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

router.post('/getpatenstatus', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    userId: Joi.number().required(),
    role_id: Joi.number().required(),
  });

  let payload = {
    userId: req.body.userId,
    role_id: req.body.role_id,
  }

  const userId = req.body.userId;
  const role_id = req.body.role_id;
  const status = req.body.status;

  if (role_id == 18) {
    PatenSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrevs b LEFT JOIN mspatens a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' AND a.KODE_INPUT = ' + userId + ' ')
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
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          status: 500
        });
      });
  } else {
    PatenSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrevs b LEFT JOIN mspatens a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' ')
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

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = PatenSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Paten berhasil ditambahkan',
          id: result.id,
        }));
    } catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
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

router.post('/adddokumen', checkAuth, function (req, res, next) {

  let validate = Joi.object().keys({
    nomor_pendaftar: Joi.string().required(),
    dokumen: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    role: Joi.number().required(),
    jenis_dokumen: Joi.number().required(),
    downloadable: Joi.number().required(),
  });

  const payload = {
    nomor_pendaftar: req.body.nomor_pendaftar,
    dokumen: req.body.dokumen,
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

router.post('/getpatendraft', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    PatenSchema.sequelize.query({
      query: "SELECT mp.*,dp.*, mpg.* FROM mspatens mp JOIN dpatens dp ON mp.id = dp.id_paten JOIN mspegawais mpg ON dp.nik = mpg.nik where mp.id = " + req.body.id + " ",
    }).then((data) => {
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
        'status': 'ERROR',
        'messages': error.message,
      })
    }
  });
})

router.post('/getinventorid', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    PatenSchema.sequelize.query({
      query: "SELECT DISTINCT * FROM `dpatens` WHERE id_paten = " + req.body.id + "",
    }).then((data) => {
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
        'status': 'ERROR',
        'messages': error.message,
      })
    }
  });
})

module.exports = router;
