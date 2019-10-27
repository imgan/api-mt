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
    patenSchema.sequelize.query('SELECT `mspatens`.*,(SELECT NAMA_REV FROM msrevs WHERE id = `mspatens`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrevs WHERE id = `mspatens`.`STATUS`) as STATUS FROM `mspatens` WHERE `status` = 20')
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
    patenSchema.sequelize.query('SELECT `msmereks`.*,(SELECT NAMA_REV FROM msrevs WHERE id = `msmereks`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrevs WHERE id = `msmereks`.`STATUS`) as STATUS FROM `msmereks` WHERE `status` = 20')
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
    patenSchema.sequelize.query('SELECT `msmereks`.*,(SELECT NAMA_REV FROM msrevs WHERE id = `msmereks`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrevs WHERE id = `msmereks`.`STATUS`) as STATUS FROM `msmereks` WHERE `status` = 20')
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
    patenSchema.sequelize.query('SELECT `mshakcipta`.*,(SELECT NAMA_REV FROM msrevs WHERE id = `mshakcipta`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrevs WHERE id = `mshakcipta`.`STATUS`) as STATUS FROM `mshakcipta` WHERE `status` = 20')
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
    patenSchema.sequelize.query('SELECT `msdesainindustris`.*,(SELECT NAMA_REV FROM msrevs WHERE id = `msdesainindustris`.`UNIT_KERJA`) as UNIT_KERJA, (SELECT NAMA_REV FROM msrevs WHERE id = `msdesainindustris`.`STATUS`) as STATUS FROM `msdesainindustris` WHERE `status` = 20')
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
