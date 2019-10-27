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
router.get('/download', function (req, res, next) {
    const file = `./public/file/ss.png`;
    res.download(file); // Set disposition and send it.
});

module.exports = router;
