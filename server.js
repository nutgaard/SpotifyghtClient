var express = require('express.io');
var morgan = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var SECRET = process.env.SESSION_SECRET
if(!SECRET) {
    throw new Error("env.SESSION_SECRET not set.");
}
var env = process.env.NODE_ENV || 'prod';

var config = require('./config.json')[env];
var port = process.env.PORT || config.port || 5000;
var resources = config.resources || '/app/app/';

console.log('Launching appliction in %s mode', env);

var cors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type Accept');

    console.log('user: ', req.session.username);

    next();
}

var app = express();
app.http().io();
app.io.enable('browser client minification');
app.io.enable('browser client etag');

app.use(express.cookieParser());

app.use(session( {
        store: new RedisStore({
            host: "10.0.1.100",
            port: "6379"
        }),
        secret: SECRET,
        cookie: {
                secure: false,
                httpOnly: true,
                domain: '.logisk-dev.org',
                maxAge: 1000 * 60 * 60 * 24
            }
    }
))

// session existense check
app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('oh no')); // handle error
  }
  next(); // otherwise continue
})

if (env === 'dev') {
    app.use(morgan('dev'));
    app.use(cors);
    app.use(express.static(__dirname));
}
app.post('/login', jsonParser, function(req, res) {
    var user = req.body.username;
    console.log('user: ', user);
    req.session.username = user;
    res.status(201).end();
});

app.use(express.static(__dirname +'/'+ resources));

app.listen(port, function () {
    console.log('Server started on port ', port);
});
