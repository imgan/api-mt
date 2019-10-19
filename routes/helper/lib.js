require("dotenv").config();

const express = require('express');
const desainSchema = require('../model/mshakcipta');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

/* GET users listing. */
/* GET users listing. */

router.post('/getpb', checkAuth , function (req, res, next) {
  desainSchema.findAndCountAll()
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
