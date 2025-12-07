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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const corsOptions = {
    origin: '*'
};
app.use(cors(corsOptions));
app.use(expressValidator());

// Database connection
require("./services/connection");

// Import route files
var publicRoutes = require("./routes/public");
var login = require("./routes/login");
var adminLogin = require('./routes/adminLogin');
var admin = require('./routes/admin');
var user = require('./routes/user');

// Configs
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret:'express-session secret'}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Bind routes
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/login', login);
app.use('/api/v1/adminlogin', adminLogin);
app.use('/api/v1/user', passport.authenticate('user-token', {session:false}), user);

// Admin routes with proper error handling
app.use('/api/v1/admin', (req, res, next) => {
    passport.authenticate('admin-token', { session: false }, (err, user, info) => {
        if (err) {
            console.error("Passport error:", err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or missing token' });
        }
        req.user = user;
        next();
    })(req, res, next);
}, admin);

// SPA fallback
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Error handling
app.use(function(req, res, next) {
    next(createError(404,"Invalid API. Use the official documentation to get the list of valid APIS."));
});

app.use((err, req, res, next) => {
    console.error("Express error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;
