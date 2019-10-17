require("dotenv").config();

const express = require('express');
const MerekSchema = require('../model/msmerek');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


const router = express.Router();

/* GET users listing. */
router.post('/getmerek', function (req, res, next) {
    MerekSchema.findAndCountAll()
        .then((merek) => {
          if (merek.length < 1) {
            res.status(404).json({
              message: 'Not Found',
            });
          }
          else {
            res.status(200).json({
                merek
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
