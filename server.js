var express = require('express');
var morgan = require('morgan');
var env = process.env.NODE_ENV || 'prod';

var config = require('./config.json')[env];
var port = config.port || 5000;
var resources = config.resources || '/app/app/';

console.log('Launching appliction in %s mode', env);

var cors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type Accept');
    next();
}
var app = express();
if (env === 'dev') {
    app.use(morgan('dev'));
    app.use(cors);
    app.use(express.static(__dirname));
}
app.use(express.static(__dirname +'/'+ config.resources));

app.listen(config.port, function () {
    console.log('Server started on port ', config.port);
});

