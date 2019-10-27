require('dotenv').config();

const express = require('express');
const UserSchema = require('../model/muser');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const salt = process.env.SALT;

/* GET users listing. */


router.post('/getalluser', checkAuth, function (req, res, next) {
  UserSchema.findAndCountAll({
    attributes: {
      exclude: ['gambar', 'abstrak']
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
});

module.exports = router;
