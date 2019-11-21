require("dotenv").config();

const express = require('express');
const sequelize = require('sequelize');
const PatenSchema = require('../model/mspaten');
const dPatenSchema = require('../model/msdpaten');
const pegawaiSchema = require('../model/mspegawai');
const nonpegawaiSchema = require('../model/msnonpegawai');
const DokumenSchema = require('../model/msdokumen');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    if (file.mimetype === 'text/plain') {
      filetype = 'txt';
    }
    cb(null, 'file-' + Date.now() + '.' + filetype);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

/* GET users listing. */
router.post('/getinventor', checkAuth, function (req, res, next) {
  dPatenSchema.sequelize.query('SELECT DISTINCT `dpaten`.*,`mspegawai`.`NIK`,`mspegawai`.`NAMA` FROM `dpaten` JOIN `mspegawai` ON `dpaten`.`NIK` = `mspegawai`.`NIK`')
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

router.post('/getdokumenver', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    nomor_pendaftar: Joi.string().required(),
    role: Joi.number().required(),
  });

  let payload = {
    nomor_pendaftar: req.body.nomor_pendaftar,
    role: req.body.role,
  }
 const {nomor_pendaftar, role} = payload  

  Joi.validate(payload, validate, (error) => {
    dPatenSchema.sequelize.query("SELECT msd.*,msj.*,msj.id FROM msdokumen msd JOIN msjenisdokumen msj ON msd.jenis_dokumen = msj.id WHERE msd.nomor_pendaftar = '"+nomor_pendaftar+"' AND msd.role = '"+role+"'")
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
    if(error){
      res.status(400).json({
        message: 'Required',
        error
      });
    }
  })

});

router.post('/getnoninventor', checkAuth, function (req, res, next) {
  dPatenSchema.sequelize.query('SELECT DISTINCT `dpaten`.*,`msnonpegawais`.`NIK`,`msnonpegawai`.`NAMA` FROM `dpaten` JOIN `msnonpegawai` ON `dpaten`.`NIK` = `msnonpegawai`.`NIK`')
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

router.post('/getpaten', checkAuth, function (req, res, next) {
  PatenSchema.findAndCountAll({
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

router.post('/getpatenbyyear', checkAuth, function (req, res, next) {
  PatenSchema.sequelize.query('SELECT * FROM (SELECT YEAR(createdAt) as tahun,count(*) as total ' +
    'FROM mspaten GROUP BY YEAR(TGL_INPUT) DESC LIMIT 5)as paten ORDER BY tahun ASC')
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

router.post('/getpatendiajukandetail', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  let payload = {
    id: req.body.id,
  }
  Joi.validate(payload, validate, (error) => {
    PatenSchema.sequelize.query(
      'SELECT `mspaten`.*,(SELECT ' +
      'nama_rev ' +
      ' FROM ' +
      ' msrevs '+
      ' WHERE '+
       ' id = `mspaten`.`jenis_paten`) as jenis_paten, (SELECT nama_rev FROM msrev WHERE id = `mspaten`.`unit_kerja`) as unit_kerja FROM `mspaten` WHERE`mspaten`.`status` = 20 AND`mspaten`.`id` = "'+req.body.id+'"')
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
      if(error){
        res.status(400).json({
          'status': 'Required',
          'messages': error.message,
        })
      }
  })
});


router.post('/getpatenstatus', checkAuth, function (req, res, next) {
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
    PatenSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrev b LEFT JOIN mspaten a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' AND a.KODE_INPUT = ' + userId + ' ')
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
    PatenSchema.sequelize.query('SELECT a.pernah_diajukan,a.judul,a.id,a.createdAt,b.keterangan,b.nama_rev FROM msrev b LEFT JOIN mspaten a ON b.ID = a.UNIT_KERJA WHERE a.status = ' + status + ' ')
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

router.post('/addpaten', checkAuth, async function (req, res, next) {
  var base64Data = req.body.abstrak;
  var base64Data2 = req.body.gambar;


  require("fs").writeFileSync(`./public/file/${req.body.abstrak_name}`, base64Data, 'base64', function (error , data) {
    console.log('File Berhasil Di generate');
  });

  require("fs").writeFileSync(`./public/file/${req.body.gambar_name}`, base64Data2, 'base64', function (error , data) {
    console.log('File Berhasil Di generate');
  });

  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    jenis_paten: Joi.number().required(),
    unit_kerja: Joi.string().required(),
    bidang_invensi: Joi.string().required(),
    status: Joi.string().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_input: Joi.string().required(),
  });

  let payload = {
    judul: req.body.judul,
    jenis_paten: req.body.jenis_paten,
    unit_kerja: req.body.unit_kerja,
    bidang_invensi: req.body.bidang_invensi,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input
  }

  const schema = {
    judul: req.body.judul,
    jenis_paten: req.body.jenis_paten,
    unit_kerja: req.body.unit_kerja,
    bidang_invensi: req.body.bidang_invensi,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_input: req.body.kode_input,
    abstrak: req.body.abstrak_name,
    gambar: req.body.gambar_name
  }
  Joi.validate(payload, validate, (error) => {
    try {
      const paten = PatenSchema.create(schema)
        .then(result => res.status(201).json({
          status: 201,
          messages: 'Paten berhasil ditambahkan',
          id: result.id,
        }));
    } catch (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
      })
    }
    if (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
      })
    }
  })
});

router.post('/getpatendraft', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    PatenSchema.sequelize.query('SELECT `mspaten`.*,`dpaten`.*, `mspegawai`.* '+
      ' FROM `mspaten` '+
     ' JOIN `dpaten` ON `mspaten`.`ID` = `dpaten`.`ID_PATEN` '+
      ' JOIN `mspegawai` ON `dpaten`.`NIK` = `mspegawai`.`NIK` '+
     ' WHERE `mspaten`.`ID` = ' + req.body.id + " ")
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
    if (error) {
      res.status(400).json({
        'status': 'ERROR',
        'messages': error.message,
      })
    }
  });
})
router.post('/getinventorbyid', checkAuth, function (req, res, next) {
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


router.post('/getpatenbyid', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    PatenSchema.findAndCountAll({
      // attributes: {exclude: ['gambar']},
      where: {
        id: req.body.id,
      }
      
    })
      .then((data) => {
        if (data === 0) {
          res.status(404).json({
            status: 404,
            message: 'Not Found',
          });
        } else {
          res.status(200).json(
            {
              data
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

router.post('/deletedpatenbyid', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    dPatenSchema.destroy({
      where: {
        id_paten: req.body.id,
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

router.post('/deletedpatenbyip', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
  });

  const payload = {
    id: req.body.id,
  }

  Joi.validate(payload, validate, (error) => {
    dPatenSchema.destroy({
      where: {
        id_paten: req.body.id,
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
    PatenSchema.destroy({
      where: {
        id: req.body.id,
      }
    })
      .then((data) => {
        if (data === 0) {
          res.status(404).json({
            status: 404,
            message: 'Not Found',
          });
        }
        dPatenSchema.destroy({
          where: {
            id_paten: req.body.id,
          }
        })
          .then((dpaten) => {
            DokumenSchema.destroy({
              where: {
                nomor_pendaftar: req.body.id
              }
            })
            res.status(200).json(
              {
                status: 200,
                message: 'Delete Succesfully'
              }
            )
          })
      })
    if (error) {
      res.status(400).json({
        'status': 'Required',
        'messages': error.message,
      })
    }
  });
})

router.post('/fgetdocumentbycode', checkAuth, function (req, res, next) {
  PatenSchema.sequelize.query('SELECT * FROM msdokumen WHERE ROLE = 1 AND SIZE > 0 AND NOMOR_PENDAFTAR = "'+req.body.code +'"' ,{type: PatenSchema.sequelize.QueryTypes.SELECT})
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
  PatenSchema.sequelize.query('SELECT `dpaten`.*,`mspegawai`.`nik`,`mspegawai`.`nama` '+
  ' FROM `dpaten` JOIN `mspegawai` ON `dpaten`.`NIK` = `mspegawai`.`NIK` '+
  ' WHERE `dpaten`.`ID_PATEN` =  "'+req.body.id+'"' +
  ' UNION SELECT `dpaten`.*,`msnonpegawai`.`nik`,`msnonpegawai`.`nama` '+
  ' FROM `dpaten` JOIN `msnonpegawai` ON `dpaten`.`NIK` = `msnonpegawai`.`NIK`' +
  ' WHERE `dpaten`.`ID_PATEN` = "'+req.body.id+'"', {type: PatenSchema.sequelize.QueryTypes.SELECT})
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

router.post('/fgetpatenbyid', checkAuth, function (req, res, next) {
  PatenSchema.sequelize.query('SELECT `mspaten`.*, (SELECT NAMA_REV FROM msrev WHERE '+
      ' ID = `mspaten`.`UNIT_KERJA`) as satuan_kerja, '+
     ' (SELECT NAMA_REV FROM msrev WHERE ID = `mspaten`.`STATUS`) as status_ '+
     ' FROM `mspaten` '+
    ' WHERE `mspaten`.`id` = "'+req.body.id +'"' ,{type: PatenSchema.sequelize.QueryTypes.SELECT})
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

router.post('/fgetjmlpaten', checkAuth, function (req, res, next) {
  PatenSchema.sequelize.query('SELECT YEAR(createdAt) as tahun,count(*) as total from mspaten WHERE `status` = 21 GROUP BY YEAR(createdAt)' ,{type: PatenSchema.sequelize.QueryTypes.SELECT})
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

router.post('/fgetpaten', checkAuth, function (req, res, next) {
  PatenSchema.sequelize.query('SELECT `mspaten`.*,`msrev`.`nama_rev` '+
  ' FROM `msrev` '+
  ' JOIN `mspaten` ON `msrev`.`ID` = `mspaten`.`UNIT_KERJA` '+
  ' WHERE `mspaten`.`status` = 21' ,{type: PatenSchema.sequelize.QueryTypes.SELECT})
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


router.post('/ajukan', checkAuth, function (req, res, next) {
  let validate = Joi.object().keys({
    id: Joi.number().required(),
    status : Joi.number().required(),
    pernah_diajukan : Joi.number().required()
  });

  const payload = {
    id: req.body.id,
    status : req.body.status,
    pernah_diajukan : req.body.pernah_diajukan
  }

  Joi.validate(payload, validate, (error) => {
    PatenSchema.update({
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
            message : 'Update diajukan Succesfully',
            status : 200
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

router.post('/updatepatensave', checkAuth, function (req, res, next) {
  // if(req.body.abstrak !== undefined && req.body.abstrak_name !== undefined) {
    var base64Data = req.body.abstrak;
    require("fs").writeFileSync(`./public/file/${req.body.abstrak_name}`, base64Data, 'base64', function (error, data) {
      console.log('File Berhasil Di generate');
    });
  // }
  // if(req.body.gambar !== undefined && req.body.gambar_name !== undefined) {
    var base64Data2 = req.body.gambar;
    require("fs").writeFileSync(`./public/file/${req.body.gambar_name}`, base64Data2, 'base64', function (error, data) {
      console.log('File Berhasil Di generate');
    });
  // }


  const payload = {
    judul: req.body.judul,
    // abstrak: req.body.abstrak,
    bidang_invensi: req.body.bidang_invensi,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_ubah: req.body.kode_ubah,
    tgl_ubah: req.body.tgl_ubah
  }
  const schema = {
    judul: req.body.judul,
    abstrak: req.body.abstrak_name,
    gambar: req.body.gambar_name,
    bidang_invensi: req.body.bidang_invensi,
    unit_kerja: req.body.unit_kerja,
    status: req.body.status,
    no_handphone: req.body.no_handphone,
    ipman_code: req.body.ipman_code,
    kode_ubah: req.body.kode_ubah,
    tgl_ubah: req.body.tgl_ubah
  }
  let validate = Joi.object().keys({
    judul: Joi.string().required(),
    // abstrak: Joi.string().required(),
    bidang_invensi: Joi.string().required(),
    unit_kerja: Joi.string().required(),
    status: Joi.number().required(),
    no_handphone: Joi.string().required(),
    ipman_code: Joi.string().required(),
    kode_ubah: Joi.string().required(),
    tgl_ubah: Joi.string().required(),
  });
  
  Joi.validate(payload, validate, (error) => {
    PatenSchema.update(schema, {
      where: {
        id: req.body.id
      }
    }).then((data,error) => {
      res.status(200).json({
        'status': 'Update Successfuly',
      }).catch((error) => {
      console.log(error)
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

router.post('/updateverifikasipatensave', checkAuth, function (req, res, next) {
  const payload = {
    nomor_permohonan: req.body.nomor_permohonan,
    pemeriksa_paten: req.body.pemeriksa_paten,
    kontak_pemeriksa: req.body.kontak_pemeriksa,
    email_pemeriksa: req.body.email_pemeriksa,
    sertifikasi: req.body.sertifikasi,
    filling: req.body.filling,
    formalitas: req.body.formalitas,
    publis: req.body.publis,
    pembayaran: req.body.pembayaran,
    pemberian: req.body.pemberian,
    nomor_paten: req.body.nomor_paten,
    tahun_granted: req.body.tahun_granted,
    status: req.body.status,
    tindak_lanjut: req.body.tindak_lanjut,
    keterangan: req.body.keterangan,
  }

  let validate = Joi.object().keys({
    // judul: Joi.string().required(),
    nomor_permohonan: Joi.string().required(),
    pemeriksa_paten: Joi.string().required(),
    kontak_pemeriksa: Joi.string().required(),
    email_pemeriksa: Joi.string().required(),
    sertifikasi: Joi.string().required(),
    filling: Joi.string().required(),
    formalitas: Joi.string().required(),
    publis: Joi.string().required(),
    pembayaran: Joi.string().required(),
    pemberian: Joi.string().required(),
    nomor_paten: Joi.string().required(),
    tahun_granted: Joi.string().required(),
    status: Joi.number().required(),
    tindak_lanjut: Joi.number().required(),
    keterangan: Joi.string().required(),
  });
  Joi.validate(payload, validate, (error) => {
    PatenSchema.update(payload, {
      where: {
        id: req.body.id
      }
    }).then((data) => {
      res.status(200).json({
        'status': 200,
        'message': 'Update Successfuly',
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



module.exports = router;
