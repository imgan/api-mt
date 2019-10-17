require("dotenv").config();

const express = require('express');
const PatenSchema = require('../model/mspaten');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


const router = express.Router();

/* GET users listing. */
router.post('/getpaten', function (req, res, next) {
    PatenSchema.findAndCountAll()
        .then((paten) => {
          if (paten.length < 1) {
            res.status(404).json({
              message: 'Not Found',
            });
          }
          else {
            res.status(200).json({
                paten
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
