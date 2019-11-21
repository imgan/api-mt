require('dotenv').config();

const express = require('express');
const UserSchema = require('../model/muser');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const salt = process.env.SALT;
const { gettoken, register } = require('../lib/gateway');

/* GET users listing. */
router.get('/dedi', (req, res) => {
  res.send('index', { title: 'Expresssssss' });
});

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

  Joi.validate(payload, validate, (error) => {
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
        const cek = UserSchema.findAll({
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
            role_id: req.body.role_id,
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
      });
    }
    catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
        'data': {},
      })
    }
    if(error){
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
        'data': {},
      })
    }
  }
  )
});

router.post('/login', (req, res) => {
  try {
    const validate = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const payload = {
      email: req.body.email,
      password: req.body.password,
    };

    Joi.validate(validate, payload, async () => {
      try {
        const data = await gettoken(req.body.email, req.body.password);
        res.status(200).json({
          error: false,
          data: data,
        });
      } catch (error) {
        res.status(400).json({
          status: 500,
          messages: error,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      error,
      status: 500,
    });
  }
});

router.post('/getuserrole', checkAuth, function (req, res, next) {
  UserSchema.sequelize.query('SELECT msuser.*, (SELECT NAMA_REV FROM msrev WHERE id = `msuser`.`role_id`) as role, (SELECT NAMA_REV FROM msrev WHERE id = `msuser`.`is_active`) as status FROM msuser')
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
