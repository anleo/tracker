'use strict';
let express = require('express');
let passport = require('passport');

let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let flash = require('connect-flash');

let app = express();

require('./../app/config/application').wrap(app);

app.container.get('Mongoose').set('debug', true);

require('./../app/config/passport')(passport);

app.container.get('GridFS');
app.container.get('Tokenizer');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.enable('trust proxy');
app.use(flash());

app.set('trust proxy', 1);
app.use(session({
    secret: app.config.get('session:secret'),
    cookie: {maxAge: 4 * 7 * 24 * 60 * 60 * 1000}, // 4 weeks
    resave: true,
    saveUninitialized: true,
    rolling: true,
    store: app.container.get('MongoSessionStore')
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (err, req, res, next) {
    console.error(req.url, err);
    console.log(req.url, new Date(), err, require('util').inspect(err, {depth: null}));
    next(err);
});

app.use(function (err, req, res, next) {
    if (err) {
        res.status(500).send(err.message);
    } else {
        next();
    }
});

module.exports = app;
