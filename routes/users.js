const express = require('express');
const UserSchema = require('../model/muser');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res) => {
  let validate = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  });

  let payload = {
    email: req.body.email,
    password: req.body.password
  }

  Joi.validate(payload, validate)
    .then(validated => {
      UserSchema.findAll({
        where: {
          email: req.body.email,
          password: req.body.password
        }
      })
        .then((user) => {
          console.log(user);
          if (user.length < 1) {
            res.status(401).json({
              message: 'Email atau Password Salah !!!',
            });
          }
          else {
            res.status(200).json({
              message: 'Success',
              email: user[0].email,
              role_id: user[0].role_id,
              nama: user[0].name,
              image: user[0].image,
              is_active: user[0].is_active,
              status: 200
              // token,
            });
          }
          // });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
            status: 500
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        err: err.details,
        name: err.name
      })
    })
});

router.get('/register', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
