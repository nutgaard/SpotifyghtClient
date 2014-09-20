var express = require('express.io');
var morgan = require('morgan');
var env = process.env.NODE_ENV || 'prod';

var config = require('./config.json')[env];
var port = process.env.PORT || config.port || 5000;
var resources = config.resources || '/app/app/';

console.log('Launching appliction in %s mode', env);

var cors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type Accept');
    next();
}

var app = express();
app.http().io();
app.io.enable('browser client minification');
app.io.enable('browser client etag');

if (env === 'dev') {
    app.use(morgan('dev'));
    app.use(cors);
    app.use(express.static(__dirname));
}
app.use(express.static(__dirname +'/'+ resources));

app.listen(port, function () {
    console.log('Server started on port ', port);
});
