module.exports = function (app) {
    let _ = require('lodash');

    let TaskService = app.container.get('TaskService');
    let UserService = app.container.get('UserService');
    let User = app.container.get('User');
    let Task = app.container.get('Task');

    app.get('/api/users/:userId', function (req, res, next) {
        User.findById(req.params.userId, '-local.passwordHashed -local.passwordSalt', function (err, user) {
            if (err) {
                return next(err);
            }

            res.json(user);
        });
    });

    app.get('/api/users/:userId/tasks', function (req, res, next) {
        let query = {
            $and: [
                {developer: req.user},
                {
                    $and: [
                        {
                            status: {$ne: 'accepted'}
                        },
                        {
                            archived: {$ne: true}
                        }
                    ]
                }

            ]
        };

        TaskService.getTasksByQuery(query, function (err, tasks) {
            if (err) {
                return next(err);
            }

            res.json(tasks);
        });
    });

    app.get('/api/users/me/projects', function (req, res, next) {
        let users = [];

        let query = {
            $or: [
                {owner: req.user._id},
                {team: req.user._id}
            ],
            $and: [
                {
                    $or: [
                        {
                            parentTaskId: {$exists: false}
                        },
                        {
                            parentTaskId: null,
                        }
                    ]
                }
            ]
        };

        Task.find(query)
            .lean()
            .exec()
            .then((tasks) => {
                let usersIds = [];

                tasks.forEach((task) => {
                    usersIds = usersIds.concat(task.team);
                    _.uniq(usersIds, (user) => user.toString());
                });

                if (!usersIds.length) {
                    return res.json(users);
                }

                UserService.getUsers(usersIds, function (err, users) {
                    if (err) {
                        return next(err);
                    }

                    res.json(users);
                });
            }, (err) => next(err));
    });
};
