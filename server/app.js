var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('serverKey.key', 'utf8');
var certificate = fs.readFileSync('serverCert.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate}

const db = require('./api/database');
const cors = require("cors");

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

var httpsServer = https.createServer(credentials, app);

const allowedOrigins = ["http://localhost:3000", "http://localhost:8080", "https://localhost:8443", "https://localhost:8081"];

app.use(
    cors({
        origin: function(origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/',(request, response) => {
    response.json({
        message: 'Hello'
    });
});

app.get('/api/getUsers', db.getUsers);
app.get('/api/getLeaderboard', db.getLeaderboard);
app.post('/api/login', db.checkLogin);
app.post('/api/registerAccount', db.registerAccount);
app.post('/api/resetPassword', db.resetPassword);

function notFound(request, response, next){
    const error = new Error('Not Found - ' +  request.originalUrl);
    response.status(404);
    next(error);
}

function errorHandler(error, request, response, next){
    response.status(response.statusCode || 500);
    response.json({
        message: error.message,
        error: process.env.NODE_ENV === 'production' ? {} : error.stack,
    });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
