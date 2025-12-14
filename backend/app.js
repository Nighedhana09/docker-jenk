var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const helmet = require('helmet');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var passport = require("./services/passportconf");
var app = express();
const cors = require('cors');

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(expressValidator());

// DB
require("./services/connection");

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'express-session secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Backend is running' });
});

// Routes
app.use('/api/v1/public', require("./routes/public"));
app.use('/api/v1/login', require("./routes/login"));
app.use('/api/v1/adminlogin', require('./routes/adminLogin'));
app.use('/api/v1/user', passport.authenticate('user-token', {session:false}), require('./routes/user'));

app.use('/api/v1/admin',
  passport.authenticate('admin-token', { session: false }),
  require('./routes/admin')
);

// 404
app.use((req, res, next) => {
  next(createError(404, "Invalid API"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;
