require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Sequelize = require('sequelize');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var patensRouter = require('./routes/patens');
var mereksRouter = require('./routes/mereks');
var hakciptasRouter = require('./routes/hakcipta');
var desainindustiRouter = require('./routes/desainindustri');
var pegawaiRouter = require('./routes/pegawai');
const nonpegawaiRouter = require('./routes/nonpegawai');
const revRouter = require('./routes/rev');
const jenisdokumenRouter = require('./routes/jenisdokumen');
const dokumenRouter = require('./routes/dokumen');
const msipmancodeRouter = require('./routes/helper/lib');
const dpatenRouter = require('./routes/dpaten');
const dmerekRouter = require('./routes/mereks');
const downloadRouter = require('./routes/download');
const exportRouter = require('./routes/helper/exportexcel');
const pembayaranRouter = require('./routes/pembayaran');












const UserModel = require('./model/muser');
const PatenModel = require('./model/mspaten');
const MerekModel = require('./model/msmerek');
const HakciptaModel = require('./model/mshakcipta');
const DesainModel = require('./model/msdesainindustri');
const PegawaiModel = require('./model/mspegawai');
const NonpegawaiModel = require('./model/msnonpegawai');
const RevModel = require('./model/msrev');
const jenisdokumenModel = require('./model/msjenisdokumen');
const msipmancodeModel = require('./model/msipmancode');
const dpatenmodel = require('./model/msdpaten');
const msdokumen = require('./model/msdokumen');
const msdmerek = require('./model/msdmerek');
const msdhakcipta = require('./model/msdhakcipta');
const pembayaran = require('./model/trpembayaran');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/patens', patensRouter);
app.use('/mereks', mereksRouter);
app.use('/hakciptas', hakciptasRouter);
app.use('/desain', desainindustiRouter);
app.use('/pegawai', pegawaiRouter);
app.use('/nonpegawai', nonpegawaiRouter);
app.use('/rev', revRouter);
app.use('/jenisdokumen', jenisdokumenRouter);
app.use('/lib', msipmancodeRouter);
app.use('/patens', dpatenRouter);
app.use('/dokumen', dokumenRouter);
app.use('/mereks', dmerekRouter);
app.use('/download', downloadRouter);
app.use('/exportexcel', exportRouter);
app.use('/pembayaran', pembayaranRouter);





app.use('/public', express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  // operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
sequelize
  .authenticate()
  .then(() => {
    sequelize.sync({
      force:true
    });
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
