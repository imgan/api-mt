require("dotenv").config();

const express = require('express');
const hakciptaSchema = require('../model/mshakcipta');
const dhakciptaSchema = require('../model/msdhakcipta');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();


router.post('/ajukan', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
    status : Joi.number().required(),
    pernah_diajukan : Joi.number().required()
  });

  const payload = {
    id: req.body.id,
    status : req.body.status,
    pernah_diajukan : req.body.pernah_diajukan
  }

  Joi.validate(payload, validate, (error) => {
    hakciptaSchema.update({
      status: payload.status,
      pernah_diajukan: payload.pernah_diajukan,
    },
    {
      where: {
        id: payload.id,
      }
    })
      .then((data) => {
        if (data === 0) {
          res.status(404).json({
            status: 404,
            message: 'Not Found',
          });
        } else {
          res.status(200).json({
            message : 'Update diajukan Succesfully',
            status : 200
          })
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


router.post('/gethakciptastatus', checkAuth, function (req, res, next) {
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
    hakciptaSchema.sequelize.query('SELECT msh.*,msr.nama_rev FROM msrevs msr JOIN mshakcipta msh ON msr.id = msh.unit_kerja WHERE msh.status = ' + status + ' AND msh.kode_input = ' + userId + ' ')
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
    hakciptaSchema.sequelize.query('SELECT msh.*,msr.nama_rev FROM msrevs msr JOIN mshakcipta msh ON msr.id = msh.unit_kerja WHERE msh.status = ' + status + ' ')
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

router.post('/getpencipta', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT DISTINCT dp.*,mp.nik, mp.nama from dhakcipta dp JOIN mspegawais mp ON dp.nik = mp.nik')
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

router.post('/getnonpencipta', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT DISTINCT dp.*,mp.nik, mp.nama from dhakcipta dp JOIN msnonpegawais mp ON dp.nik = mp.nik')
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

router.post('/gethakciptabyyear', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT * FROM (SELECT YEAR(createdAt) as tahun,count(*) as total ' +
    'FROM hakcipta GROUP BY YEAR(TGL_INPUT) DESC LIMIT 5)as paten ORDER BY tahun ASC')
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

router.post('/adddhakcipta', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    id_hakcipta: Joi.number().required(),
    nik: Joi.string().required(),
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



router.post('/deletedraft', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    hakciptaSchema.destroy({
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
        dhakciptaSchema.destroy({
          where: {
            id_hakcipta: req.body.id,
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
