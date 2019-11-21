require("dotenv").config();

const express = require('express');
const rev = require('../model/msrev');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

router.post('/getrolenotpengembang', checkAuth, function (req, res, next) {
    rev.sequelize.query("SELECT id,nama_rev FROM msrev WHERE golongan = 5 AND nama_rev != 'Pengembang'")
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
  });

/* GET users listing. */
router.post('/', checkAuth, function (req, res, next) {
    if (req.body.golongan > 0) {
        rev.findAndCountAll({
            where: {
                golongan: req.body.golongan
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
    } else {
        rev.findAndCountAll()
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
                console.log(err);
                res.status(500).json({
                    error: err,
                    status: 500
                });
            });
    }

});

router.post('/getrevbyid', checkAuth, function (req, res, next) {
    rev.findAndCountAll({
        where: {
            id: req.body.id
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
        })
});
module.exports = router;
