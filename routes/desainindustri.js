require("dotenv").config();

const express = require('express');
const desainSchema = require('../model/msdesainindustri');
const ddesainSchema = require('../model/msddesainindustri');
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
    desainSchema.update({
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
router.post('/getipmancode', checkAuth, function (req, res, next) {
  ipmancodeschema.findAndCountAll({
    where: {
      kode: 'DI'
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

router.post('/getdesain', checkAuth, function (req, res, next) {
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

router.post('/getdesaindraftdetail', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.string().required(),
  });

  let payload = {
    id: req.body.id,
  }
  Joi.validate(payload, validate, (error) => {
    desainSchema.sequelize.query('SELECT `msdesainindustri`.*,`ddesainindustri`.*, `mspegawai`.* FROM `msdesainindustri`  JOIN `ddesainindustri` ON `msdesainindustri`.`ID` = `ddesainindustri`.`ID_DESAIN_INDUSTRI` JOIN `mspegawai` ON `ddesainindustri`.`NIK` = `mspegawai`.`NIK` WHERE `msdesainindustri`.`ID` = "' + req.body.id + '"')
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
        'status': 'Required',
        'messages': error.message,
      })
    }
  })

});

router.post('/getdesaindraftdiajukan', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.string().required(),
  });

  let payload = {
    id: req.body.id,
  }
  Joi.validate(payload, validate, (error) => {
    desainSchema.sequelize.query('SELECT `msdesainindustri`.*,`msrev`.`NAMA_REV`' +
      'FROM `msrev` ' +
      'JOIN `msdesainindustri` ON `msrev`.`ID` = `msdesainindustri`.`UNIT_KERJA` ' +
      'WHERE `msdesainindustri`.`status` = 20 ' +
      'AND `msdesainindustri`.`ID` = "' + req.body.id + '"')
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
        'status': 'Required',
        'messages': error.message,
      })
    }
  })

});


router.post('/adddesainindustri', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    unit_kerja: Joi.number().required(),
    status: Joi.number().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_input: Joi.string().required(),
    tgl_input: Joi.string().required(),
  });

  let payload = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input,
    tgl_input: req.body.tgl_input,
  }

  let schema = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input,
    tgl_input: req.body.tgl_input,
    abstrak: req.body.abstrak,
    gambar: req.body.gambar
  }

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = desainSchema.create(schema)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Desain Industri berhasil ditambahkan',
          id: result.id,
        }));
    } catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error,
      })
    }
    if (error) {
      res.status(400).json({
        messages: error.message
      })
    }
  })
});

router.post('/addddesainindustri', checkAuth, async function (req, res, next) {

  let validate = Joi.object().keys({
    id_desain_industri: Joi.string().required(),
    nik: Joi.number().required(),
  });

  let payload = {
    id_desain_industri: req.body.id_desain_industri,
    nik: req.body.nik,
  }

  Joi.validate(payload, validate, (error) => {
    try {
      const paten = ddesainSchema.create(payload)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Desain Industri berhasil ditambahkan',
          id: result.id,
        }));
    } catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error,
      })
    }
    if (error) {
      res.status(400).json({
        messages: error.message
      })
    }
  })
});

router.post('/getdesainstatus', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    userId: Joi.number().required(),
    role_id: Joi.number().required(),
    status: Joi.number().required(),

  });

  let payload = {
    userId: req.body.userId,
    role_id: req.body.role_id,
    status: req.body.status
  }

  const userId = req.body.userId;
  const role_id = req.body.role_id;
  const status = req.body.status;

  Joi.validate(payload, validate, (error) => {
    if (role_id == 18) {
      desainSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrev b LEFT JOIN msdesainindustri a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' AND a.KODE_INPUT = ' + userId + ' ')
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
      desainSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrev b LEFT JOIN msdesainindustri a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' ')
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
    if (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
      })
    }
  })

});


router.post('/getnonpendesain', checkAuth, function (req, res, next) {
  ddesainSchema.sequelize.query('SELECT DISTINCT dp.*,mp.nik, mp.nama from ddesainindustri dp JOIN msnonpegawais mp ON dp.nik = mp.nik')
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

router.post('/getdesaindiajukandetail', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  let payload = {
    id: req.body.id,
  }
  Joi.validate(payload, validate, (error) => {
    desainSchema.sequelize.query('SELECT `msdesainindustri`.*,`msrev`.`nama_rev` ' +
      ' FROM `msrev` ' +
      ' JOIN `msdesainindustri` ON `msrev`.`id` = `msdesainindustri`.`unit_kerja` ' +
      ' WHERE `msdesainindustri`.`status` = 20 ' +
      ' AND `msdesainindustri`.`ID` = "' + req.body.id + '"')
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

router.post('/getdesainbyyear', checkAuth, function (req, res, next) {
  desainSchema.sequelize.query('SELECT * FROM (SELECT YEAR(createdAt) as tahun,count(*) as total ' +
    'FROM msdesainindustri GROUP BY YEAR(TGL_INPUT) DESC LIMIT 5)as paten ORDER BY tahun ASC')
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
      res.status(500).json({
        error: err,
        status: 500
      });
    });
});
router.post('/getallpendesain', checkAuth, function (req, res, next) {
  ddesainSchema.sequelize.query('SELECT DISTINCT `dmerek`.*,`mspegawai`.`nik`,`mspegawai`.`nama` FROM `dmerek` JOIN `mspegawai` ON `dmerek`.`nik` = `mspegawai`.`nik` UNION SELECT DISTINCT `dmerek`.*,`msnonpegawai`.`nik`,`msnonpegawai`.`nama` FROM `dmerek` JOIN `msnonpegawai` ON `dmerek`.`nik` = `msnonpegawai`.`nik`')
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

router.post('/getallnonpendesain', checkAuth, function (req, res, next) {
  ddesainSchema.sequelize.query('    SELECT DISTINCT `dmerek`.*,`msnonpegawai`.`nik`,`msnonpegawai`.`nama` FROM `dmerek` JOIN `msnonpegawai` ON `dmerek`.`nik` = `msnonpegawai`.`nik` UNION SELECT DISTINCT `dmerek`.*,`msnonpegawai`.`nik`,`msnonpegawai`.`nama` FROM `dmerek` JOIN `msnonpegawai` ON `dmerek`.`nik` = `msnonpegawai`.`nik`')
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
      console.log(err);
      res.status(500).json({
        error: err,
        status: 500
      });
    });
});

router.post('/getpendesain', checkAuth, function (req, res, next) {
  ddesainSchema.sequelize.query('SELECT DISTINCT `ddesainindustri`.*,`mspegawai`.`nik`,`mspegawai`.`nama` fROM `ddesainindustri` JOIN `mspegawai` ON `ddesainindustri`.`nik` = `mspegawai`.`nik`')
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
  ddesainSchema.sequelize.query('SELECT DISTINCT * FROM `ddesainindustri` ' +
    'WHERE `ddesainindustri`.`id_desain_industri` = "' + req.body.id + '"')
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



router.post('/deletedraft', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    desainSchema.destroy({
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
        ddesainSchema.destroy({
          where: {
            id_desain_industri: req.body.id,
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

router.post('/updatedesainsave', checkAuth, function (req, res, next) {

  const payload = {
    judul: req.body.judul,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    kode_ubah: req.body.kode_ubah,
    tgl_ubah: req.body.tgl_ubah
  }

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    unit_kerja: Joi.string().required(),
    status: Joi.number().required(),
    no_handphone: Joi.string().required(),
    kode_ubah: Joi.string().required(),
    tgl_ubah: Joi.string().required(),
  });
  Joi.validate(payload, validate, (error) => {
    desainSchema.update(payload, {
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

router.post('/deleteddesainbyid', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    ddesainSchema.destroy({
      where: {
        id_desain_industri: req.body.id,
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

router.post('/updateverifikasidesainsave', checkAuth, function (req, res, next) {

  const payload = {
    nomor_pendaftar: req.body.nomor_pendaftar,//
    pemeriksa_desain: req.body.pemeriksa_desain,//
    kontak_pemeriksa: req.body.kontak_pemeriksa,//
    email_pemeriksa: req.body.email_pemeriksa,//
    sertifikasi: req.body.sertifikasi,//
    tahun_granted: req.body.tahun_granted,//
    tahun_pendaftar: req.body.tahun_pendaftar,//
    status: req.body.status,//
    keterangan: req.body.keterangan,//
  }

  let validate = Joi.object().keys({
    nomor_pendaftar: Joi.string().required(),
    pemeriksa_desain: Joi.string().required(),
    kontak_pemeriksa: Joi.string().required(),
    email_pemeriksa: Joi.string().required(),
    sertifikasi: Joi.string().required(),
    tahun_pendaftar: Joi.string().required(),
    tahun_granted: Joi.string().required(),
    status: Joi.number().required(),
    keterangan: Joi.string().required(),
  });
  Joi.validate(payload, validate, (error) => {
    desainSchema.update(payload, {
      where: {
        id: req.body.id
      }
    }).then((data) => {
      res.status(200).json({
        'status': 200,
        'message': 'Update Succesfully'
      })
    })
    if (error) {
      res.status(400).json({
        'status': 'Required' + error,
        'messages': error,
      })
    }
  })
})

router.post('/fgetdesain', checkAuth, function (req, res, next) {
  desainSchema.sequelize.query('SELECT `msdesainindustri`.*,`msrev`.`nama_rev`' +
    'FROM `msrev` ' +
    'JOIN `msdesainindustri` ON `msrev`.`ID` = `msdesainindustri`.`UNIT_KERJA` ' +
    'WHERE `msdesainindustri`.`status` = 21' ,{type: desainSchema.sequelize.QueryTypes.SELECT})
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

router.post('/fgetpendesainbyid', checkAuth, function (req, res, next) {
  ddesainSchema.sequelize.query('SELECT `ddesainindustri`.*,`mspegawai`.`nik`,`mspegawai`.`nama` FROM `ddesainindustri` JOIN `mspegawai` ON `ddesainindustri`.`nik` = `mspegawai`.`nik`' +
    'WHERE `ddesainindustri`.`id_desain_industri` = "' + req.body.id + '" group by ddesainindustri.id UNION SELECT `ddesainindustri`.*,`msnonpegawai`.`nik`,`msnonpegawai`.`nama` ' +
    ' FROM `ddesainindustri` ' +
    ' JOIN `msnonpegawai` ON `ddesainindustri`.`nik` = `msnonpegawai`.`nik`' +
   ' WHERE `ddesainindustri`.`id_desain_industri` = "' + req.body.id + '" group by ddesainindustri.id' ,{type: desainSchema.sequelize.QueryTypes.SELECT})
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

router.post('/fgetjmldesain', checkAuth, function (req, res, next) {
  desainSchema.sequelize.query('SELECT YEAR(TGL_INPUT) as tahun,count(*) as total from msdesainindustri WHERE `status` = 21 GROUP BY YEAR(TGL_INPUT)' ,{type: desainSchema.sequelize.QueryTypes.SELECT})
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

router.post('/fgetdesainbyid', checkAuth, function (req, res, next) {
  desainSchema.sequelize.query('SELECT `msdesainindustri`.*, '+
  ' (SELECT nama_rev FROM msrev WHERE ID = `msdesainindustri`.`UNIT_KERJA`) as satuan_kerja, (SELECT NAMA_REV FROM msrev WHERE ID = `msdesainindustri`.`STATUS`) as status_ ' +
  'FROM `msdesainindustri` '+
  'WHERE `msdesainindustri`.`ID` = "'+ req.body.id +'"', {type: desainSchema.sequelize.QueryTypes.SELECT})
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
  desainSchema.sequelize.query('SELECT * FROM msdokumen WHERE ROLE = 1 AND SIZE > 0 AND NOMOR_PENDAFTAR = "'+req.body.code +'"' ,{type: desainSchema.sequelize.QueryTypes.SELECT})
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
