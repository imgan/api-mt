require('dotenv').config();

const express = require('express');
const UserSchema = require('../model/muser');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function (req, res, next) {

  let validate = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    role_id: Joi.number().required()
  });

  let payload = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    role_id: req.body.role_id,
  }

  Joi.validate(payload, validate)
    .then(validated => {
      try {
        const {
          name,
          email,
          password,
          role_id,
          is_active
        } = req.body;

        bcrypt.hash(password, 10, async function (err, hash) {
          // Store hash in your password DB.
          try {
            const cek = await UserSchema.findAll({
              where: {
                email: req.body.email
              }
            })
            if (cek.length > 0) {
              res.status(401).json({
                status: 401,
                messages: 'Email Already Exist',
              })
            } else {
              const users = await UserSchema.create({
                name,
                email,
                password: hash,
                role_id: 13,
                is_active: 3,
              });
              if (users) {
                res.status(201).json({
                  status: 200,
                  messages: 'User berhasil ditambahkan',
                  data: users,
                })
              }
            }

          } catch (error) {
            res.status(400).json({
              'status': 'ERROR',
              'messages': err.message,
              'data': {},
            })
          }
        });
      }
      catch (err) {
        res.status(400).json({
          'status': 'ERROR',
          'messages': err.message,
          'data': {},
        })
      }
    }
    )

});

router.post('/login', (req, res) => {
  let validate = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  });

  let payload = {
    email: req.body.email,
    password: req.body.password,
  }

  Joi.validate(payload, validate)
    .then(validated => {
      bcrypt.hash(req.body.password, process.env.SALT, function (err, hash) {
        // Store hash in database
        UserSchema.findAll({
          where: {
            email: req.body.email,
          }
        })
          .then((user) => {
            if (user.length < 1) {
              res.status(401).json({
                message: 'Email atau Password Salah !!!',
              });
            }
            else {
              var signOptions = {

              };
              bcrypt.compare(req.body.password, user.password, function (err, result) {
                const token = jwt.sign({ email: user[0].email, role: user[0].role_id, is_active: user[0].is_active }, process.env.JWTKU, {
                  expiresIn: "30d"
                });
                res.status(200).json({
                  message: 'Success',
                  status: 200,
                  email : user[0].email,
                  role: user[0].role_id,
                  is_active : user[0].is_active,
                  token: token,
                });
              });
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

    })
});



module.exports = router;
