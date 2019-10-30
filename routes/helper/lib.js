require("dotenv").config();

const express = require('express');
const ipmancodeSchema = require('../../model/msipmancode');
const DokumenSchema = require('../../model/msdokumen');
const Joi = require('joi');
const multer = require('multer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const checkAuth = require('../../middleware/check-auth');


const router = express.Router();

/* GET users listing. */

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
    if (file.mimetype === 'application/pdf') {
      filetype = 'pdf';
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
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'text/plain' || file.mimetype === 'application/pdf') {
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


router.post('/adddokumen', checkAuth, function (req, res, next) {
  var base64Data = req.body.dokumen;

  require("fs").writeFileSync(`./public/file/${req.body.name}`, base64Data, 'base64', function (error, data) {
    console.log('File Berhasil Di generate');
  });

  // console.log(encode_image);

  let validate = Joi.object().keys({
    nomor_pendaftar: Joi.string().required(),
    // dokumen: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    role: Joi.number().required(),
    size: Joi.number().required(),
    jenis_dokumen: Joi.number().required(),
    // downloadable: Joi.number().required(),
  });

  const payload = {
    nomor_pendaftar: req.body.nomor_pendaftar,
    size: req.body.size,
    // dokumen: req.body.dokumen,
    name: req.body.name,
    type: req.body.type,
    role: req.body.role,
    jenis_dokumen: req.body.jenis_dokumen,
    // downloadable: req.body.downloadable
  }

  const schema = {
    nomor_pendaftar: req.body.nomor_pendaftar,
    size: req.body.size,
    name: req.body.name,
    type: req.body.type,
    role: req.body.role,
    jenis_dokumen: req.body.jenis_dokumen,
    downloadable: req.body.downloadable
  }

  Joi.validate(payload, validate, (error) => {
    const paten = DokumenSchema.create(schema)
      .then(result => res.status(201).json({
        status: 201,
        messages: 'Dokumen berhasil ditambahkan',
      }));
    if (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
      })
    }
  })
});

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

router.post('/deletedokumenbyip', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    nomor_pendaftar: Joi.string().required(),
  });

  const payload = {
    nomor_pendaftar: req.body.nomor_pendaftar,
  }

  Joi.validate(payload, validate, (error) => {
    DokumenSchema.destroy({
      where: {
        nomor_pendaftar: req.body.nomor_pendaftar,
        role: 1,
        rev : 0
      }
    })
      .then((data) => {
        if (data === 0) {
          res.status(404).json({
            status: 404,
            message: 'Not Found',
          });
        }
        else {
          res.status(200).json(
            {
              status: 200,
              message: 'Delete Succesfully'
            }
          )
        }
      })
    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  });
})

module.exports = router;
