require("dotenv").config();

const express = require('express');
const DpatenSchema = require('../model/msdpaten');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

router.post('/adddpaten', checkAuth, async function (req, res, next) {
    const data = {
        nik: req.body.nik,
        id_paten: req.body.id_paten
    }
    try {
        const dpaten = DpatenSchema.create(data);
        if (dpaten) {
            res.status(201).json({
                status: 200,
                messages: 'dpaten berhasil ditambahkan',
                data: dpaten,
            })
        }
    } catch (error) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': error.message,
            'data': {},
        })
    }
});

module.exports = router;
