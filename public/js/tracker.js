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
    .controller('TaskCtrl', function ($scope, Task, $stateParams) {

        $scope.statuses = [
            "open", "in progress", "done", "accepted"
        ];


        $scope.priorities = [0,1,2,3,4,5,6,7,8,9,10];

        $scope.complexities = [
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
            },
        ];

        $scope.complexityHuman = function (complexity) {
         var result = '';
          $scope.complexities.forEach(function (item) {
              if (item.value == complexity) {
                  result = item.name;
              }
          })
            return result;
        };

        var init = function () {

            if ($stateParams.taskId) {
                Task.query({taskId: $stateParams.taskId, nested: 'tasks'}, function (tasks) {
                    $scope.tasks = tasks;
                    $scope.task = Task.get({taskId: $stateParams.taskId});
                });
            } else {
                $scope.tasks = Task.query();
            }

            $scope.newTask = new Task({
                simple: true
            });

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


;


