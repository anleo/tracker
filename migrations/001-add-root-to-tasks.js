'use strict';
let es = require('event-stream');
let ps = es.pause();

let app = require('./common');


let Task = app.container.get('Task');
let TaskService = app.container.get('TaskService');

exports.up = function (next) {
    Task.find({})
        .lean()
        .stream()
        .pipe(ps)
        .pipe(es.map(function (task, next) {
            ps.pause();

            TaskService.getRoot(task, function (err, root) {
                if (err) {
                    console.log('>> err', err, err.stack);
                    ps.resume();

                    return next();
                }

                Task.update({_id: task._id}, {$set: {root: root._id}}, function (err) {
                    if (err) {
                        ps.resume();
                        console.log('>> err', err, err.stack);
                        return next();
                    }

                    ps.resume();
                    next();
                })
            });
        }))
        .on('error', function (err) {
            console.log('err', err);
        })
        .on('end', next);

};

exports.down = function (next) {
    next();
};
