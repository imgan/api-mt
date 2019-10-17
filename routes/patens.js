require("dotenv").config();

const express = require('express');
const sequelize = require('sequelize');
const PatenSchema = require('../model/mspaten');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

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

router.post('/getpatenbyyear',  checkAuth,  function (req, res, next) {
  PatenSchema.sequelize.query('SELECT * FROM (SELECT YEAR(TGL_INPUT) as tahun,count(*) as total '+
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

router.post('/getpatendraft',  checkAuth,  function (req, res, next) {
  let validate = Joi.object().keys({
    userId: Joi.string().required()
  });

  let payload = {
    userId: req.body.userId,
  }
  const userId = req.body.userId
  
  PatenSchema.sequelize.query('SELECT a.*,b.NAMA_REV FROM msrevs b JOIN mspatens a ON b.ID = a.UNIT_KERJA WHERE a.status = 19 AND a.KODE_INPUT = '+userId+' ')
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



module.exports = router;
