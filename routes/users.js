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
        console.log(hash);
        // Store hash in database
        UserSchema.sequelize.query('SELECT a.name, a.email, a.image, a.role_id, a.is_active,b.nama_rev,b.status,b.keterangan,golongan from msusers a join msrev b on a.role_id = b.id where a.email = "' +req.body.email+'" ',
          { replacements: { status: 'active', type: UserSchema.sequelize.QueryTypes.SELECT }})
          .then((user) => {
            if (user[0].length < 1) {
              res.status(401).json({
                message: 'Email atau Password Salah !!!',
              });
            }
            else {
              const users = user[0];

              bcrypt.compare(hash, users[0].password, function (err, result) {
                const token = jwt.sign({ email: users[0].email, role: users[0].role_id, is_active: users[0].is_active }, process.env.JWTKU, {
                  expiresIn: "30d"
                });
                res.status(200).json({
                  message: 'Success',
                  status: 200,
                  email : users[0].email,
                  role: users[0].role_id,
                  is_active : users[0].is_active,
                  name : users[0].name,
                  image : users[0].image,
                  nama_rev : users[0].nama_rev,
                  status_rev : users[0].status,
                  keterangan : users[0].keterangan,
                  golongan : users[0].golongan,
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
