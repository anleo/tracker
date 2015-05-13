angular
    .module('Tracker', ['ui.router', 'ngResource', 'ui.bootstrap'])

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.interceptors.push('HttpInterceptor');

        $urlRouterProvider.otherwise("/app/tasks");

        $stateProvider
            .state('app', {
                url: "/app",
                templateUrl: "templates/app.html"
            })
            .state('app.tasks', {
                url: "/tasks",
                templateUrl: "templates/task.html",
                controller: 'TaskCtrl'
            })
            .state('app.task', {
                url: "/tasks/:taskId",
                templateUrl: "templates/task.html",
                controller: 'TaskCtrl'
            })
            .state('app.login', {
                url: "/login",
                controller: "LoginCtrl",
                templateUrl: "templates/login.html"
            })
            .state('app.register', {
                url: "/register",
                controller: "RegisterCtrl",
                templateUrl: "templates/register.html"
            })
            .state('app.logout', {
                url: "/logout",
                controller: "LogoutCtrl"
            })
            .state('app.report', {
                url: "/report",
                controller: "ReportCtrl",
                templateUrl: "templates/report.html"
            })
        ;

    })

    .factory('HttpInterceptor', function ($q, $injector) {
        return {
            'responseError': function (rejection) {
                if (rejection.status == 401) {
                    $injector.get('$state').go('app.login')
                }
                return $q.reject(rejection);
            }
        };
    })

    .factory('Task', function ($resource) {
        return $resource('/api/tasks/:taskId/:nested', {taskId: '@_id'}, {update: {method: 'PUT'}});
    })
    .factory('TaskMove', function ($resource) {
        return $resource('/api/tasks/:taskId/move/:parentTaskId', {}, {update: {method: 'PUT'}});
    })
    .factory('TaskUpdated', function ($resource) {
        return $resource('/api/tasks/updated');
    })

    .factory('taskComplexity', function () {
        return complexities = [
            {
                name: '0',
                value: 0
            },
            {
                name: '0+',
                value: 1
            },
            {
                name: '1',
                value: 2
            },
            {
                name: '1+',
                value: 3
            },
            {
                name: '2',
                value: 4
            },
            {
                name: '2+',
                value: 5
            },
            {
                name: '3',
                value: 6
            },
            {
                name: '3+',
                value: 7
            },
            {
                name: '4',
                value: 8
            },
            {
                name: '4+',
                value: 9
            },
            {
                name: '5',
                value: 10
            },
            {
                name: '5+',
                value: 11
            }
        ]
    })
    .filter('humanComplexity', function (taskComplexity) {

        return function (complexity) {
            var result = '';
            taskComplexity.forEach(function (item) {
                if (item.value == complexity) {
                    result = item.name;
                }
            });
            return result;
        };

    })
    .filter('round', function ($filter) { // filter for rounding numbers
        return function (number) {

            var result = $filter('currency')(number, '');

            return result;
        };

    })
    .filter('byStatus', function () {

        return function (tasks, status) {
            var result = [];
            tasks.forEach(function (task) {
                if (task.status == status) {
                    result.push(task);
                }
            });
            return result;
        };

    })

    .controller('ReportCtrl', function ($scope, TaskUpdated) {

        $scope.date = moment().format("ddd, hh:mm");

        TaskUpdated.query(function (tasks) {
            $scope.tasks = tasks;
        })
    })

    .controller('TaskCtrl', function ($scope, Task, $stateParams, taskComplexity, TaskMove, $state) {

        $scope.views = [
            {title: 'Default', name: 'default'},
            {title: 'Board', name: 'board'},
            {title: 'Tree', name: 'tree'}
        ];

        $scope.view = $scope.views[0];

        $scope.statuses = [
            {name: 'New', value: ""},
            {name: 'In Progress', value: "in progress"},
            {name: 'Accepted', value: "accepted"}
        ];

        $scope.loadView = function (view) {
            $scope.view = view;
        };

        $scope.priorities = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        $scope.addTimeList = [
            {
                name: '5m',
                value: 0.1
            },
            {
                name: '15m',
                value: 0.25
            },
            {
                name: '30m',
                value: 0.5
            },
            {
                name: '1h',
                value: 1
            }
        ];

        $scope.complexities = taskComplexity;

        var init = function () {

            if ($stateParams.taskId) {
                Task.query({taskId: $stateParams.taskId, nested: 'tasks'}, function (tasks) {
                    $scope.tasks = tasks;
                    $scope.task = Task.get({taskId: $stateParams.taskId}, function (task) {
                        if (task.parentTaskId) {
                            $scope.parentTask = Task.get({taskId: task.parentTaskId});
                        }
                    });

                }, function () {
                    $state.go('app.tasks');
                });
            } else {
                $scope.tasks = Task.query();
            }

            $scope.newTask = new Task({
                simple: true,
                status: "",
                priority: 5
            });

            $scope.tasksForMove = [];

        };

        init();

        $scope.save = function () {

            if (!$scope.newTask._id) {

                if ($stateParams.taskId) {
                    $scope.newTask.$save({taskId: $stateParams.taskId, nested: 'tasks'}).then(init);
                } else {
                    $scope.newTask.$save().then(init);
                }
            }

            else {
                $scope.newTask.$update().then(init);
            }

        };

        $scope.edit = function (task) {
            $scope.newTask = task;
        };

        $scope.delete = function (task) {
            task.$delete().then(function () {
                init()
            });

        };

        $scope.close = function () {
            init();
        };

        $scope.getTasksForMove = function () {
            if ($scope.newTask) {
                TaskMove.query({taskId: $scope.newTask._id}, function (tasks) {
                    $scope.tasksForMove = tasks;
                })
            }


        };

        $scope.move = function (task) {
            new TaskMove().$update({taskId: $scope.newTask._id, parentTaskId: task._id}).then(init);
        };

        $scope.addTime = function (time) {
            if ($scope.newTask) {
                var spenttime = $scope.newTask.spenttime || 0;
                spenttime += time.value;

                spenttime = parseInt(Math.ceil(spenttime * 100)) / 100;
                $scope.newTask.spenttime = spenttime;
            }
        };

    })

    .factory('Login', function ($resource) {
        return $resource('/api/login');
    })
    .controller('LoginCtrl', function ($scope, Login, $state) {

        $scope.login = function () {

            Login.save({
                username: $scope.userName,
                password: $scope.userPassword
            }, function () {
                $state.go('app.tasks');
            })

        }

    })
    .factory('Logout', function ($resource) {
        return $resource('/api/logout');
    })
    .controller('LogoutCtrl', function ($scope, Logout, $state) {
        Logout.save(function () {
            $state.go('app.login');
        });
    })
    .factory('Register', function ($resource) {
        return $resource('/api/register');
    })
    .controller('RegisterCtrl', function ($scope, Register, $state) {

        $scope.register = function () {

            Register.save({
                username: $scope.userName,
                password: $scope.userPassword
            }, function () {
                $state.go('app.tasks');
            })

        }

    })
    .directive('taskMetrics', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/task/metrics.html',
            scope: {
                task: "=task"
            }
        }
    })
    .directive('taskPanel', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/task/task-panel.html',
            controller: function ($scope) {
                $scope.edit = function (task) {
                    if ($scope.onEdit) {
                        $scope.onEdit(task);
                    }
                }
            },
            scope: {
                task: "=task",
                onEdit: "=taskOnEdit"
            }
        }
    })


;


