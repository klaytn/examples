var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');

dotenv.config();

var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/auth', authRouter);

app.use(function(req, res, next) {
  res.status(404).json({success: false, message: 'API not found'});
});

module.exports = app;
