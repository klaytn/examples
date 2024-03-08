var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/api', indexRouter);

app.use(function(req, res, next) {
  res.status(404).json({success: false, message: 'API not found'});
});

module.exports = app;
