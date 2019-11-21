require('dotenv').config();

const express = require('express');
const patenSchema = require('../../model/mspaten');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../../middleware/check-auth');

const router = express.Router();
/* GET users listing. */


router.post('/getallpaten', checkAuth, function (req, res, next) {
    patenSchema.sequelize.query('SELECT `mspaten`.*,(SELECT NAMA_REV FROM msrev WHERE id = `mspaten`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrev WHERE id = `mspaten`.`STATUS`) as STATUS FROM `mspaten` WHERE `status` = 20')
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
      res.status(500).json({
        error: err,
        status: 500
      });
    });
});

router.post('/getallmerek', checkAuth, function (req, res, next) {
    patenSchema.sequelize.query('SELECT `msmerek`.*,(SELECT NAMA_REV FROM msrev WHERE id = `msmerek`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrev WHERE id = `msmerek`.`STATUS`) as STATUS FROM `msmerek` WHERE `status` = 20')
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
      res.status(500).json({
        error: err,
        status: 500
      });
    });
}); 

router.post('/getallmerek', checkAuth, function (req, res, next) {
    patenSchema.sequelize.query('SELECT `msmerek`.*,(SELECT NAMA_REV FROM msrev WHERE id = `msmerek`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrev WHERE id = `msmerek`.`STATUS`) as STATUS FROM `msmerek` WHERE `status` = 20')
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
      res.status(500).json({
        error: err,
        status: 500
      });
    });
}); 

router.post('/getallhakcipta', checkAuth, function (req, res, next) {
    patenSchema.sequelize.query('SELECT `mshakcipta`.*,(SELECT NAMA_REV FROM msrev WHERE id = `mshakcipta`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrev WHERE id = `mshakcipta`.`STATUS`) as STATUS FROM `mshakcipta` WHERE `status` = 20')
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
      res.status(500).json({
        error: err,
        status: 500
      });
    });
}); 

router.post('/getalldesain', checkAuth, function (req, res, next) {
    patenSchema.sequelize.query('SELECT `msdesainindustri`.*,(SELECT NAMA_REV FROM msrev WHERE id = `msdesainindustri`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrev WHERE id = `msdesainindustri`.`STATUS`) as STATUS FROM `msdesainindustri` WHERE `status` = 20')
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
      res.status(500).json({
        error: err,
        status: 500
      });
    });
}); 

module.exports = router;
