var express = require('express');

var app = express();
app.application = require('./app/config/application');
app.config = app.application.config;
app.container = app.application.container;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

app.container.get('Mongoose');
app.container.get('GridFS');
app.container.get('Tokenizer');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.enable('trust proxy');
app.use(flash());

var MongoSessionStore = require('connect-mongo')(session);

app.set('trust proxy', 1);
app.use(session({
    secret: app.config.get('session:secret'),
    cookie: { maxAge: 4*7*24*60*60*1000 }, // 4 weeks
    resave: true,
    saveUninitialized: true,
    rolling: true,
    store: new MongoSessionStore({ url: app.config.get('mongo:uri') })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


// passport
require('./app/config/passport')(passport);

// app routes
require('./app/routes/app.routes')(app, passport);

// cron
require('./app/config/cron')(app.container.get('Cron'), app.container);

app.use(function (err, req, res, next) {
    console.log(req.url, err);
    next(err);
});

if (app.config.get('fixtures:load')) {
    console.log('> load fixtures');

    var fixtures = require('pow-mongodb-fixtures').connect(app.config.get('mongo:uri'));
    fixtures.clearAndLoad(__dirname + '/app/config/fixtures', function (err) {
        if (err) console.error(err);
    });
}

var server = app.listen(app.config.get('app:port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Tracker app listening at http://%s:%s | env %s', host, port, app.config.get('env'))
});