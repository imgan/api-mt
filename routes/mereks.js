require("dotenv").config();

const express = require('express');
const MerekSchema = require('../model/msmerek');
const DmerekSchema = require('../model/msdmerek');
const ipmancodeschema = require('../model/msipmancode');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

router.post('/getdokumenver', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    code: Joi.string().required(),
  });

  let payload = {
    code: req.body.code
  }
  Joi.validate(payload, validate, (error) => {
    MerekSchema.sequelize.query('SELECT `msdokumens`.*,`msjenisdokumens`.*,`msjenisdokumens`.`id` '+
    'FROM `msdokumens` '+
    'JOIN `msjenisdokumens` ON `msdokumens`.`JENIS_DOKUMEN` = `msjenisdokumens`.`ID` '+
    'WHERE `msdokumens`.`NOMOR_PENDAFTAR` = "' + req.body.code + '"  AND `msdokumens`.`ROLE` = 1')
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
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          status: 500
        });
      });
    if (error) {
      res.status(400).json({
        error: error.message,
        status: 400
      });
    }
  })

});

/* GET users listing. */
router.post('/ajukan', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
    status: Joi.number().required(),
    pernah_diajukan: Joi.number().required()
  });

  const payload = {
    id: req.body.id,
    status: req.body.status,
    pernah_diajukan: req.body.pernah_diajukan
  }

  Joi.validate(payload, validate, (error) => {
    MerekSchema.update({
      status: payload.status,
      pernah_diajukan: payload.pernah_diajukan,
    },
      {
        where: {
          id: payload.id,
        }
      })
      .then((data) => {
        if (data === 0) {
          res.status(404).json({
            status: 404,
            message: 'Not Found',
          });
        } else {
          res.status(200).json({
            message: 'Update diajukan Succesfully',
            status: 200
          })
        }
      })
    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  });
})

router.post('/getmerekbyyear', checkAuth, function (req, res, next) {
  MerekSchema.sequelize.query('SELECT * FROM (SELECT YEAR(createdAt) as tahun,count(*) as total ' +
    'FROM msmerek GROUP BY YEAR(TGL_INPUT) DESC LIMIT 5)as paten ORDER BY tahun ASC')
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({
          message: 'Not Found',
        });
      }
      else {
        // console.log(data[0][0].tahun)
        res.status(200).json({
          data
        })
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

router.post('/getmerek', checkAuth, function (req, res, next) {
  MerekSchema.findAndCountAll()
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

router.post('/fgetmerek', checkAuth, function (req, res, next) {
  MerekSchema.sequelize.query('SELECT `msmerek`.*,`msrev`.`nama_rev` '+
  ' FROM `msrev`' +
  ' JOIN `msmerek` ON `msrev`.`ID` = `msmerek`.`unit_kerja` ' +
  ' WHERE `msmerek`.`status` = 21' ,{type: MerekSchema.sequelize.QueryTypes.SELECT})
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({
          message: 'Not Found',
        });
      }
      else {
        res.status(200).json(
          data
        )
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

router.post('/getmerekbyid', checkAuth, function (req, res, next) {
  MerekSchema.findAndCountAll({
    where: {
      id: req.body.id
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

router.post('/getpendesainbyid', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id
  }
  Joi.validate(payload, validate, (error) => {
    MerekSchema.sequelize.query('SELECT DISTINCT * FROM `dmerek` ' +
      ' WHERE `dmerek`.`ID_MEREK` = "' + req.body.id + '"')
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
          status: 400
        });
      });
    if (error) {
      res.status(500).json({
        error: error.message,
        status: 500
      });
    }
  })

});

router.post('/getipmancode', checkAuth, function (req, res, next) {
  ipmancodeschema.findAndCountAll({
    where: {
      kode : 'MR'
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
        status: 400
      });
    });
});

router.post('/getmerekdiajukandetail', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    status: Joi.number().required(),
    id: Joi.number().required(),
  });

  let payload = {
    status: req.body.status,
    id: req.body.id,
  }
  Joi.validate(payload, validate, (error) => {
    MerekSchema.sequelize.query('SELECT msm.*,msr.nama_rev FROM msrevs msr  JOIN msmerek msm ON msr.id = msm.unit_kerja WHERE msm.status = "' + req.body.status + '" AND msm.id = "' + req.body.id + '"')
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
    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  })
});
router.post('/getmerekdraftdetail', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  let payload = {
    id: req.body.id,
  }
  Joi.validate(payload, validate, (error) => {
    MerekSchema.sequelize.query('SELECT `msmerek`.*,`dmerek`.*, `mspegawai`.* '+
   ' FROM `msmerek` '+
   ' JOIN `dmerek` ON `msmerek`.`ID` = `dmerek`.`ID_merek` '+
  ' JOIN `mspegawai` ON `dmerek`.`NIK` = `mspegawai`.`NIK` '+ 
   ' WHERE `msmerek`.`ID` = "' + req.body.id + '"')
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
    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  })
});

router.post('/getmerekdiajukandetail', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    status: Joi.number().required(),
    id: Joi.number().required(),
  });

  let payload = {
    status: req.body.status,
    id: req.body.id,
  }
  Joi.validate(payload, validate, (error) => {
    MerekSchema.sequelize.query('SELECT msm.*,msr.nama_rev FROM msrevs msr  JOIN msmerek msm ON msr.id = msm.unit_kerja WHERE msm.status = "' + req.body.status + '" AND msm.id = "' + req.body.id + '"')
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
    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  })
});


router.post('/getmerekstatus', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    userId: Joi.number().required(),
    role_id: Joi.number().required(),
  });

  let payload = {
    userId: req.body.userId,
    role_id: req.body.role_id,
  }

  const userId = req.body.userId;
  const role_id = req.body.role_id;
  const status = req.body.status;

  if (role_id == 18) {
    MerekSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrevs b LEFT JOIN msmerek a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' AND a.KODE_INPUT = ' + userId + ' ')
      .then((data) => {
        if (data.length < 1) {
          res.status(404).json({
            message: 'Not Found',
          });
        }
        else {
          res.status(200).json({
            data,
          })
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          status: 500
        });
      });
  } else {
    MerekSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrevs b LEFT JOIN msmerek a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' ')
      .then((data) => {
        if (data.length < 1) {
          res.status(404).json({
            message: 'Not Found',
          });
        }
        else {
          res.status(200).json({
            data,
          })
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
          status: 500
        });
      });
  }
});


router.post('/addmerek', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    unit_kerja: Joi.number().required(),
    status: Joi.number().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_input: Joi.string().required(),
    kelas: Joi.string().required(),
  });

  let payload = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input,
    kelas: req.body.kelas,
  }

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = MerekSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Merek berhasil ditambahkan',
          id: result.id,
        }));
    } catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error,
        'data': {},
      })
    }
    if (error) {
      res.status(400).json({
        messages: error.message
      })
    }
  })
});

router.post('/adddmerek', checkAuth, async function (req, res, next) {
  let validate = Joi.object().keys({
    id_merek: Joi.number().required(),
    nik: Joi.number().required(),
  });

  let payload = {
    id_merek: req.body.id_merek,
    nik: req.body.nik,
  }

  Joi.validate(payload, validate, (error) => {
    const schema = {
      id_merek: req.body.id_merek,
      nik: req.body.nik,
    } = req.body;
    try {
      const dmerek = dmerekSchema.create(schema)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'DMerek berhasil ditambahkan',
          id: result.id,
        }));
    } catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error,
        'data': {},
      })
    }
    if (error) {
      res.status(400).json({
        messages: error.message
      })
    }
  })
})

router.post('/deletedmerek', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id_merek: Joi.number().required(),
  });

  const payload = {
    id_merek: req.body.id_merek,
  }

  Joi.validate(payload, validate, (error) => {
    dmerekSchema.destroy({
      where: {
        id_merek: req.body.id_merek,
      }
    })
      .then((data) => {
          res.status(200).json(
            {
              status: 200,
              message: 'Delete Succesfully'
            }
          )
      })
    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  });
})

router.post('/deletedraft', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    MerekSchema.destroy({
      where: {
        id: req.body.id,
      }
    })
      .then((data) => {
        if (data === 0) {
          res.status(404).json({
            stataus: 404,
            message: 'Not Found',
          });
        }
        dmerekSchema.destroy({
          where: {
            id_merek: req.body.id,
          }
        })
        res.status(200).json(
          {
            stataus: 200,
            message: 'Delete Succesfully'
          }
        )
      })
    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  });
})

router.post('/updateverifikasisave', checkAuth, function (req, res, next) {

  const payload = {
    nomor_pendaftar: req.body.nomor_pendaftar,
    pemeriksa_merek: req.body.pemeriksa_merek,
    kontak_pemeriksa: req.body.kontak_pemeriksa,
    email_pemeriksa: req.body.email_pemeriksa,
    sertifikasi: req.body.sertifikasi,
    tahun_granted: req.body.tahun_granted,
    tahun_pendaftaran: req.body.tahun_pendaftaran,
    status: req.body.status,
    keterangan: req.body.keterangan,
  }

  let validate = Joi.object().keys({
    nomor_pendaftar: Joi.string().required(),
    pemeriksa_merek: Joi.string().required(),
    kontak_pemeriksa: Joi.string().required(),
    email_pemeriksa: Joi.string().required(),
    sertifikasi: Joi.string().required(),
    tahun_pendaftaran: Joi.string().required(),
    tahun_granted: Joi.string().required(),
    status: Joi.number().required(),
    keterangan: Joi.string().required(),
  });
  Joi.validate(payload, validate, (error) => {
    MerekSchema.update(payload, {
      where: {
        id: req.body.id
      }
    }).then((data) => {
      res.status(200).json({
        'status': 200,
        'message' : 'Update Succesfully'
      })
    })
    if (error) {
      res.status(400).json({
        'status': 'Required' +error,
        'messages': error,
      })
    }
  })
})

router.post('/updatemereksave', checkAuth, function (req, res, next) {

  const payload = {
    judul: req.body.judul,
    kelas: req.body.kelas,
    unit_kerja: req.body.unit_kerja,
    no_handphone: req.body.no_handphone,
    status: req.body.status,
  }

  const schema = {
      judul: req.body.judul,
      kelas: req.body.kelas,
      unit_kerja: req.body.unit_kerja,
      no_handphone: req.body.no_handphone,
      status: req.body.status,
  }

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    kelas: Joi.string().required(),
    unit_kerja: Joi.string().required(),
    no_handphone: Joi.string().required(),
    status: Joi.number().required(),
  });
  Joi.validate(payload, validate, (error) => {
    MerekSchema.update(schema, {
      where: {
        id: req.body.id
      }
    }).then((data) => {
      // console.log(data)
      
      res.status(200).json({
        'status': 200,
        'message' : 'Update Succesfully'
      })
    })
    if (error) {
      res.status(400).json({
        'status': 'Required' +error,
        'messages': error,
      })
    }
  })
})

router.post('/fgetinventorbyid', checkAuth, function (req, res, next) {
  MerekSchema.sequelize.query('SELECT d.*,mp.nik,mp.nama'+
  ' FROM dmerek d '+
  ' JOIN mspegawai mp ON d.nik = mp.nik '+
  ' WHERE d.id_merek = "'+ req.body.id +'"', {type: MerekSchema.sequelize.QueryTypes.SELECT})
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({
          message: 'Not Found',
        });
      }
      else {
        res.status(200).json(
          data
        )
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

router.post('/fgetjmlmerek', checkAuth, function (req, res, next) {
  MerekSchema.sequelize.query('SELECT YEAR(createdAt) as tahun,count(*) as total from msmerek WHERE `status` = 21 GROUP BY YEAR(createdAt)' ,{type: MerekSchema.sequelize.QueryTypes.SELECT})
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({
          message: 'Not Found',
        });
      }
      else {
        res.status(200).json(data)
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        status: 500
      });
    });
});

router.post('/fgetmerekbyid', checkAuth, function (req, res, next) {
  MerekSchema.sequelize.query('SELECT `msmerek`.*, (SELECT NAMA_REV FROM msrev WHERE '+
     ' ID = `msmerek`.`UNIT_KERJA`) as satuan_kerja,'+ '(SELECT NAMA_REV FROM msrev WHERE ID = `msmerek`.`STATUS`) as status_ '+
      ' FROM `msmerek`' +
' WHERE `msmerek`.`id` = "'+req.body.id +'"' ,{type: MerekSchema.sequelize.QueryTypes.SELECT})
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({
          message: 'Not Found',
        });
      }
      else {
        res.status(200).json(
          data
        )
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

router.post('/fgetdocumentbycode', checkAuth, function (req, res, next) {
  MerekSchema.sequelize.query('SELECT * FROM msdokumen WHERE ROLE = 1 AND SIZE > 0 AND NOMOR_PENDAFTAR = "'+req.body.code +'"' ,{type: MerekSchema.sequelize.QueryTypes.SELECT})
    .then((data) => {
      if (data.length < 1) {
        res.status(404).json({
          message: 'Not Found',
        });
      }
      else {
        res.status(200).json(
          data
        )
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
