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
router.get('/download/:name', function (req, res, next) {
    const name = req.params.name
    const url = `./public/file/${name}`
    res.download(url); // Set disposition and send it.
});

module.exports = router;
