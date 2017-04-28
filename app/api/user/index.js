module.exports = function (app) {
    let _ = require('lodash');

    let TaskService = app.container.get('TaskService');
    let UserService = app.container.get('UserService');
    let Task = app.container.get('Task');

    app.get('/api/users/:userId', function (req, res, next) {
        UserService.getUserById(req.params.userId, function (err, user) {
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

    // TODO @@@id: for alex, we get my projects' colleagues , but in route write 'project' ?
    app.get('/api/users/me/projects', function (req, res, next) {
        TaskService.getMyColleagues(req.user, function (err, colleagues) {
            if (err) {
                return next(err);
            }

            res.json(colleagues);
        });
    });
};
