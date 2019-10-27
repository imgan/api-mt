require("dotenv").config();

const express = require('express');
const desainSchema = require('../model/msdesainindustri');
const ddesainSchema = require('../model/msddesainindustri');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

/* GET users listing. */
/* GET users listing. */

router.post('/getdesain', checkAuth, function (req, res, next) {
  desainSchema.findAndCountAll()
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

router.post('/getdesaindetail', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.string().required(),
  });

  let payload = {
    id: req.body.id,
  }
  Joi.validate(payload, validate, (error) => {
    desainSchema.sequelize.query('SELECT `msdesainindustris`.*,`ddesainindustris`.*, `mspegawais`.* FROM `msdesainindustris`  JOIN `ddesainindustris` ON `msdesainindustris`.`ID` = `ddesainindustris`.`ID_DESAIN_INDUSTRI` JOIN `mspegawais` ON `ddesainindustris`.`NIK` = `mspegawais`.`NIK` WHERE `msdesainindustris`.`ID` = "'+req.body.id+'"')
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
    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  })

});


router.post('/adddesainindustri', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    unit_kerja: Joi.number().required(),
    status: Joi.number().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_input: Joi.string().required(),
    tgl_input: Joi.string().required(),
  });

  let payload = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input,
    tgl_input: req.body.tgl_input,
  }

  let schema = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input,
    tgl_input: req.body.tgl_input,
    abstrak: req.body.abstrak,
    gambar: req.body.gambar
  }

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = desainSchema.create(schema)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Desain Industri berhasil ditambahkan',
          id: result.id,
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

router.post('/addddesainindustri', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    id_desain_industri: Joi.string().required(),
    nik: Joi.number().required(),
  });

  let payload = {
    id_desain_industri: req.body.id_desain_industri,
    nik: req.body.nik,
  }

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = ddesainSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Desain Industri berhasil ditambahkan',
          id: result.id,
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

router.post('/getdesainstatus', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    userId: Joi.number().required(),
    role_id: Joi.number().required(),
    status: Joi.number().required(),

  });

  let payload = {
    userId: req.body.userId,
    role_id: req.body.role_id,
    status: req.body.status
  }

  const userId = req.body.userId;
  const role_id = req.body.role_id;
  const status = req.body.status;

  Joi.validate(payload, validate, (error) => {
    if (role_id == 18) {
      desainSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrevs b LEFT JOIN msdesainindustris a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' AND a.KODE_INPUT = ' + userId + ' ')
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
      desainSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrevs b LEFT JOIN msdesainindustris a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' ')
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
    if (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
      })
    }
  })

});


router.post('/getnonpendesain', checkAuth, function (req, res, next) {
  ddesainSchema.sequelize.query('SELECT DISTINCT dp.*,mp.nik, mp.nama from ddesainindustris dp JOIN msnonpegawais mp ON dp.nik = mp.nik')
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

router.post('/getdesainbyyear', checkAuth, function (req, res, next) {
  PatenSchema.sequelize.query('SELECT * FROM (SELECT YEAR(createdAt) as tahun,count(*) as total ' +
    'FROM msdesainindustris GROUP BY YEAR(TGL_INPUT) DESC LIMIT 5)as paten ORDER BY tahun ASC')
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

router.post('/getpendesain', checkAuth, function (req, res, next) {
  ddesainSchema.sequelize.query('SELECT DISTINCT dp.*,mp.nik, mp.nama from ddesainindustris dp JOIN mspegawais mp ON dp.nik = mp.nik')
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


router.post('/deletedraft', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    desainSchema.destroy({
      where: {
        id: req.body.id,
      }
    })
      .then((data) => {
        if (data === 0) {
          res.status(404).json({
            stataus: 404,
            message: 'Not Found',
          });
        }
        ddesainSchema.destroy({
          where: {
            id_desain_industri: req.body.id,
          }
        })
        res.status(200).json(
          {
            stataus: 200,
            message: 'Delete Succesfully'
          }
        )
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
