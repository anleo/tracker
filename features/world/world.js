var async = require('async');
var _ = require('lodash');

module.exports = function () {


    this.World = function (callback) {

        var seleniumUrl = 'http://localhost:4444/wd/hub';

        this.chai = require('chai');
        this.chai.should();
        this.assert = this.chai.assert;

        this.webdriver = require('selenium-webdriver');

        this.waitTimeout = 3000;

        this.host = 'localhost';
        this.port = 9000;
        this.baseUrl = 'http://' + this.host + ':' + this.port;


        this.initDriver = function () {
            this.driver = new this.webdriver.Builder().
                withCapabilities(this.webdriver.Capabilities.chrome()).
                usingServer(seleniumUrl).
                build();

            this.browser = this.driver;
            this.$ = require('webdriver-sizzle')(this.browser);
        }

        this.iVisit = function (url, next) {
            this.initDriver();
            this.browser.get(this.baseUrl + url).then(next);
        }

        this.iReload = function (next) {
            this.browser.navigate().refresh().then(next)
        }

        this.iFind = function (path) {
            return this.$.all(path);
        }

        this.iFindOne = function (path) {
            return this.$(path);
        }

        this.iCount = function (path, n, callback) {

            this.browser.wait(function () {
                return this.iFind(path).then(function (elements) {
                    return elements.length == n;
                }.bind(this))

            }.bind(this), this.waitTimeout).then(function () {
                callback.call(this);
            }.bind(this), function () {
                callback.call(this, 'I should see #' + n + ' elements: ' + path);
            }.bind(this));

        }

        //takes String or Array
        this.iSee = function (paths, callback) {
            if (!_.isArray(paths)) {
                paths = [paths];
            }
            async.each(
                paths,
                (function iterator(path, cb) {
                    this.browser.wait(function () {
                        return this.iFind(path).then(function (elements) {
                            return elements.length > 0;
                        }.bind(this))

                    }.bind(this), this.waitTimeout).then(function () {
                        cb.call(this);
                    }.bind(this), function () {
                        cb('I should see: ' + path);
                    }.bind(this));
                }).bind(this),
                callback
            );
        };

        this.iDontSee = function (path, callback) {
            this.browser.wait(function () {
                return this.iFind(path).then(function (elements) {
                    return elements.length == 0;
                }.bind(this))

            }.bind(this), this.waitTimeout).then(function () {
                callback.call(this);
            }.bind(this), function () {
                callback.call(this, 'I should not see: ' + path);
            }.bind(this));
        }

        this.iSeeValue = function (path, value, callback) {
            this.iSee(path, function (err) {
                if (err) return callback.call(this, err);

                this.browser.wait(function () {
                    return this.iFindOne(path).getAttribute('value').then(function (x) {
                        return x == value
                    });
                }.bind(this), this.waitTimeout).then(function () {
                    callback.call(this);
                }.bind(this), function () {
                    callback.call(this, 'Path: `' + path + '` value should equal: `' + value + '`');
                }.bind(this));
            }.bind(this));
        }

        this.iDontSeeValue = function (path, value, callback) {
            this.iSee(path, function (err) {
                if (err) return callback.call(this, err);

                this.browser.wait(function () {
                    return this.iFindOne(path).getAttribute('value').then(function (x) {
                        return x != value
                    });
                }.bind(this), this.waitTimeout).then(function () {
                    callback.call(this);
                }.bind(this), function () {
                    callback.call(this, 'Path: `' + path + '` value should not equal: `' + value + '`');
                }.bind(this));
            }.bind(this));
        }


        this.iClick = function (path, callback) {
            this.iSee(path, function (err) {
                if (err) return callback.call(this, err);

                this.iFindOne(path).click().then(function () {
                    callback.call(this);
                }.bind(this), function () {
                    callback.call(this, 'Path: `' + path + '` is not clickable');
                }.bind(this));
            }.bind(this));
        }

        //Takes (path, value, callback) OR
        // ([{path:'',value:''}], callback)
        this.iType = function (arg1, arg2, arg3) {
            var paths = arg1, callback = arg2;

            if (!_.isArray(arg1)) {
                paths = [{path: arg1, value: arg2}];
                callback = arg3;
            }

            async.eachSeries(paths,
                (function iterator(input, cb) {
                    this.iSee(input.path, function (err) {

                        if (err) return cb.call(this, err);

                        this.iFindOne(input.path).clear().then(function () {
                            this.iFindOne(input.path).sendKeys(input.value).then(function () {
                                cb.call(this);
                            }.bind(this))
                        }.bind(this));
                    }.bind(this));
                }).bind(this),
                callback
            );
        };

        this.then = function (callback) {
            callback();
        }

        this.prepare = function (next) {
            this.prepareFixtures(next);
        }

        this.prepareFixtures = function (next) {
            require('../../server/config/container').get('FixtureLoader').reload(next);
        }

        require('cucumber.usesteps').setRootDir(__dirname + '/../')


        var chainit = require('chainit3');
        var Chain = chainit(new Function());
        this.chain = new Chain();

        this.addToChain = function (name, method) {
            if (method instanceof Function) {
                chainit.add(this.chain, name, function () {
                    return method.apply(this, arguments);
                }.bind(this));
            }
        }

        for (var name in this) {
            this.addToChain(name, this[name]);
        }


        this.createApiTester = function () {

            var tester = require('supertest');
            this.apiTester = tester(this.baseUrl);

            this.apiContentType = 'application/json;charset=UTF-8';

            this.apiCookie = [];
            this.request = null;
            this.response = null;
        }

        this.createApiTester();


        callback();

    }

}
