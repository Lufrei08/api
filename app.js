var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Banco de Dados
const dbConnection = require('./config/database')();

//Rotas
var loginRouter = require('./routes/login');
app.use('/', loginRouter);

var taskRouter = require('./routes/task');
app.use('/index', taskRouter);

var userRouter = require('./routes/user');
app.use('/user', userRouter);

//Middleware de erros
app.use(function (req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    return res.status(err.status || 500).json({ error: err.message || "INTERNAL ERROR" })
});

module.exports = app;
