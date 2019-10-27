require("dotenv").config();

const express = require('express');
const MerekSchema = require('../model/msmerek');
const DmerekSchema = require('../model/msdmerek');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

/* GET users listing. */
router.post('/getmerekbyyear', checkAuth, function (req, res, next) {
  MerekSchema.sequelize.query('SELECT * FROM (SELECT YEAR(createdAt) as tahun,count(*) as total ' +
    'FROM msmereks GROUP BY YEAR(TGL_INPUT) DESC LIMIT 5)as paten ORDER BY tahun ASC')
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

router.post('/getmerekdiajukandetail', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    status: Joi.number().required(),
    id: Joi.number().required(),
  });

  let payload = {
    status: req.body.status,
    id: req.body.id,
  }
  Joi.validate(payload, validate, (error) => {
    MerekSchema.sequelize.query('SELECT msm.*,msr.nama_rev FROM msrevs msr  JOIN msmereks msm ON msr.id = msm.unit_kerja WHERE msm.status = "' + req.body.status + '" AND msm.id = "' + req.body.id + '"')
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
      if(error){
        res.status(400).json({
          'status': 'Required',
          'messages': error.message,
        })
      }
  })
});


router.post('/getmerekstatus', checkAuth, function (req, res, next) {
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
    MerekSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrevs b LEFT JOIN msmereks a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' AND a.KODE_INPUT = ' + userId + ' ')
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
    MerekSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrevs b LEFT JOIN msmereks a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' ')
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

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = MerekSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Merek berhasil ditambahkan',
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

router.post('/adddmerek', checkAuth, async function (req, res, next) {
  let validate = Joi.object().keys({
    id_merek: Joi.number().required(),
    nik: Joi.number().required(),
  });

  let payload = {
    id_merek: req.body.id_merek,
    nik: req.body.nik,
  }

  Joi.validate(payload, validate, (error) => {
    const schema = {
      id_merek: req.body.id_merek,
      nik: req.body.nik,
    } = req.body;
    try {
      const dmerek = DmerekSchema.create(schema)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'DMerek berhasil ditambahkan',
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
})


router.post('/deletedraft', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    MerekSchema.destroy({
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
        DmerekSchema.destroy({
          where: {
            id_merek: req.body.id,
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
