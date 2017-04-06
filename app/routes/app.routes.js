module.exports = function (app, passport) {

    require('../api/auth')(app, passport);
    require('../api/task')(app);
    require('../api/history')(app);
    require('../api/report')(app);
    require('../api/files')(app);
    require('../api/user')(app);
    require('../api/board')(app);
};