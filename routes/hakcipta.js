require("dotenv").config();

const express = require('express');
const hakciptaSchema = require('../model/mshakcipta');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


const router = express.Router();

/* GET users listing. */
router.post('/gethakcipta', function (req, res, next) {
    hakciptaSchema.findAndCountAll()
        .then((hakcipta) => {
          if (hakcipta.length < 1) {
            res.status(404).json({
              message: 'Not Found',
            });
          }
          else {
            res.status(200).json({
                hakcipta
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

module.exports = router;
