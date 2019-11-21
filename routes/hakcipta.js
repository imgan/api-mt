require("dotenv").config();

const express = require('express');
const hakciptaSchema = require('../model/mshakcipta');
const dhakciptaSchema = require('../model/msdhakcipta');
const dokumenSchema = require('../model/msdokumen');

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();


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
    hakciptaSchema.update({
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

/* GET users listing. */
router.post('/gethakcipta', checkAuth, function (req, res, next) {
  hakciptaSchema.findAndCountAll()
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

router.post('/fgethakcipta', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query(' SELECT `mshakcipta`.*,`msrev`.`nama_rev` '+
  ' FROM `msrev` '+
  ' JOIN `mshakcipta` ON `msrev`.`ID` = `mshakcipta`.`UNIT_KERJA` '+
  ' WHERE `mshakcipta`.`status` = 21' ,{type: hakciptaSchema.sequelize.QueryTypes.SELECT})
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


router.post('/fgetinventorbyid', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT `dhakcipta`.*,`mspegawai`.`nik`,`mspegawai`.`nama` '+
  ' FROM `dhakcipta` '+
  ' JOIN `mspegawai` ON `dhakcipta`.`NIK` = `mspegawai`.`NIK` '+
  ' WHERE `dhakcipta`.`id_hakcipta` = "'+req.body.id+'" '+
  ' UNION SELECT `dhakcipta`.*,`msnonpegawai`.`nik`,`msnonpegawai`.`nama` '+
  ' FROM `dhakcipta` '+
  ' JOIN `msnonpegawai` ON `dhakcipta`.`NIK` = `msnonpegawai`.`NIK` '+
  ' WHERE `dhakcipta`.`id_hakcipta` = "'+req.body.id+'"', {type: hakciptaSchema.sequelize.QueryTypes.SELECT})
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

router.post('/getdokumen', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    code: Joi.string().required(),
  });

  let payload = {
    code: req.body.code
  }
  Joi.validate(payload, validate, (error) => {
    hakciptaSchema.sequelize.query('SELECT `msdokumen`.*,`msjenisdokumen`.*,`msjenisdokumen`.`id` ' +
      ' FROM `msdokumen` ' +
      'JOIN `msjenisdokumen` ON `msdokumen`.`JENIS_DOKUMEN` = `msjenisdokumen`.`ID` ' +
      ' WHERE `msdokumen`.`NOMOR_PENDAFTAR` = "' + req.body.code + '"  AND `msdokumen`.`ROLE` = 1')
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

router.post('/getdokumenver', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    code: Joi.string().required(),
  });

  let payload = {
    code: req.body.code
  }
  Joi.validate(payload, validate, (error) => {
    hakciptaSchema.sequelize.query('SELECT `msdokumen`.*,`msjenisdokumen`.*,`msjenisdokumen`.`id` ' +
      ' FROM `msdokumen` ' +
      'JOIN `msjenisdokumen` ON `msdokumen`.`JENIS_DOKUMEN` = `msjenisdokumen`.`ID` ' +
      ' WHERE `msdokumen`.`NOMOR_PENDAFTAR` = "' + req.body.code + '"  AND `msdokumen`.`ROLE` = 2')
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


router.post('/getpenciptabyid', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  let payload = {
    id: req.body.id
  }
  Joi.validate(payload, validate, (error) => {
    hakciptaSchema.sequelize.query('SELECT DISTINCT * FROM `dhakcipta`' +
      ' WHERE `dhakcipta`.`ID_HAKCIPTA` = "' + req.body.id + '"')
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
        error,
        status: 400
      });
    }
  })

});

router.post('/gethakciptadraftdetail', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  let payload = {
    id: req.body.id
  }
  Joi.validate(payload, validate, (error) => {
    hakciptaSchema.sequelize.query('SELECT `mshakcipta`.*,`dhakcipta`.*, `mspegawai`.* ' +
      'FROM `mshakcipta` ' +
      'JOIN `dhakcipta` ON `mshakcipta`.`ID` = `dhakcipta`.`ID_HAKCIPTA` ' +
      'JOIN `mspegawai` ON `dhakcipta`.`NIK` = `mspegawai`.`NIK` ' +
      'WHERE `mshakcipta`.`ID` = "' + req.body.id + '"')
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
        error,
        status: 400
      });
    }
  })

});

router.post('/getipmancode', checkAuth, function (req, res, next) {
  ipmancodeschema.findAndCountAll({
    where: {
      kode : 'HC'
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

router.post('/gethakciptastatus', checkAuth, function (req, res, next) {
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
    hakciptaSchema.sequelize.query('SELECT msh.*,msr.nama_rev FROM msrev msr JOIN mshakcipta msh ON msr.id = msh.unit_kerja WHERE msh.status = ' + status + ' AND msh.kode_input = ' + userId + ' ')
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
    hakciptaSchema.sequelize.query('SELECT msh.*,msr.nama_rev FROM msrev msr JOIN mshakcipta msh ON msr.id = msh.unit_kerja WHERE msh.status = ' + status + ' ')
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

router.post('/getpencipta', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT DISTINCT dp.*,mp.nik, mp.nama from dhakcipta dp JOIN mspegawai mp ON dp.nik = mp.nik')
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

router.post('/getnonpencipta', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT DISTINCT dp.*,mp.nik, mp.nama from dhakcipta dp JOIN msnonpegawai mp ON dp.nik = mp.nik')
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


router.post('/addhakcipta', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    unit_kerja: Joi.number().required(),
    status: Joi.number().required(),
    object: Joi.number().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_input: Joi.string().required(),
  });

  let payload = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input,
    object: req.body.object,
  }

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = hakciptaSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Hak Cipta berhasil ditambahkan',
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

router.post('/gethakciptabyyear', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT * FROM (SELECT YEAR(createdAt) as tahun,count(*) as total ' +
    'FROM mshakcipta GROUP BY YEAR(TGL_INPUT) DESC LIMIT 5)as paten ORDER BY tahun ASC')
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

router.post('/adddhakcipta', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    id_hakcipta: Joi.number().required(),
    nik: Joi.string().required(),
  });

  let payload = {
    id_hakcipta: req.body.id_hakcipta,
    nik: req.body.nik,
  }

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = dhakciptaSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Hak Cipta berhasil ditambahkan',
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

router.post('/getinventorid', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    PatenSchema.sequelize.query({
      query: "SELECT DISTINCT * FROM `dpaten` WHERE id_paten = " + req.body.id + "",
    }).then((data) => {
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
    if (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
      })
    }
  });
})

router.post('/deletedhakciptabyid', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    dhakciptaSchema.destroy({
      where: {
        id_hakcipta: req.body.id,
      }
    })
      .then((data) => {
        if (data === 0) {
          res.status(404).json({
            status: 404,
            message: 'Not Found',
          });
        }
        else {
          res.status(200).json(
            {
              status: 200,
              message: 'Delete Succesfully'
            }
          )
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

router.post('/deletedraft', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    hakciptaSchema.destroy({
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
        dhakciptaSchema.destroy({
          where: {
            id_hakcipta: req.body.id,
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

router.post('/updatehakciptasave', checkAuth, function (req, res, next) {

  const payload = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    object: req.body.object,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_ubah: req.body.kode_ubah,
    tgl_ubah: req.body.tgl_ubah
  }

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    unit_kerja: Joi.string().required(),
    object: Joi.number().required(),
    status: Joi.number().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_ubah: Joi.string().required(),
    tgl_ubah: Joi.string().required(),
    // abstrak: Joi.string().required(),

  });
  Joi.validate(payload, validate, (error) => {
    hakciptaSchema.update(payload, {
      where: {
        id: req.body.id
      }
    }).then((data) => {
      // console.log(data)
      res.status(200).json({
        'status': 200,
        'messages': 'Update Successfuly',
      })
    })

    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  })
})

router.post('/updateverifikasihakciptasave', checkAuth, function (req, res, next) {

  const payload = {
    nomor_pencatat: req.body.nomor_pencatat,//
    pemeriksa_hakcipta: req.body.pemeriksa_hakcipta,//
    kontak_pemeriksa: req.body.kontak_pemeriksa,//
    email_pemeriksa: req.body.email_pemeriksa,//
    sertifikasi: req.body.sertifikasi,//
    nomor_hakcipta: req.body.nomor_hakcipta,//
    tgl_permohonan : req.body.tgl_permohonan,//
    tgl_publish : req.body.tgl_publish,//
    // lokasi : req.body.lokasi,//
    status: req.body.status,//
    keterangan: req.body.keterangan,//
  }

  let validate = Joi.object().keys({
    nomor_pencatat: Joi.string().required(),
    pemeriksa_hakcipta: Joi.string().required(),
    kontak_pemeriksa: Joi.string().required(),
    email_pemeriksa: Joi.string().required(),
    sertifikasi: Joi.string().required(),
    nomor_hakcipta : Joi.string().required(),
    tgl_permohonan : Joi.date().required(),
    tgl_publish : Joi.date().required(),
    // lokasi: Joi.string().required(),
    status: Joi.number().required(),
    keterangan: Joi.string().required(),
  });
  Joi.validate(payload, validate, (error) => {
    hakciptaSchema.update(payload, {
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

router.post('/fgetdocumentbycode', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT * FROM msdokumen WHERE ROLE = 1 AND SIZE > 0 AND NOMOR_PENDAFTAR = "'+req.body.code +'"' ,{type: hakciptaSchema.sequelize.QueryTypes.SELECT})
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

router.post('/fgethakciptabyid', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT `mshakcipta`.*, (SELECT nama_rev FROM '+
  ' msrev WHERE ID = `mshakcipta`.`UNIT_KERJA`) as satuan_kerja, (SELECT nama_rev '+
  ' FROM msrev WHERE ID = `mshakcipta`.`STATUS`) as status_, (SELECT ' +
  ' nama_rev FROM msrev WHERE ID = `mshakcipta`.`OBJECT`) as jenis_ciptaan '+
  ' FROM `mshakcipta` WHERE `mshakcipta`.`id` = "'+req.body.id +'"' ,{type: hakciptaSchema.sequelize.QueryTypes.SELECT})
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

router.post('/fgetjmlhakcipta', checkAuth, function (req, res, next) {
  hakciptaSchema.sequelize.query('SELECT YEAR(createdAt) as tahun,count(*) as total from mshakcipta WHERE `status` = 21 GROUP BY YEAR(createdAt)' ,{type: hakciptaSchema.sequelize.QueryTypes.SELECT})
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
module.exports = router;
