;(function (window, angular) {

    'use strict';

    angular.module('app.users', ['ngRoute', 'app.services.Users'])
        .config(function ($routeProvider) {
            $routeProvider
                // URL  /users
                .when('/users', {
                    templateUrl: 'users/indexView.html',
                    controller: 'indexController'
                })
                // URL /users/new
                .when('/users/new', {
                    templateUrl: 'users/addView.html',
                    controller: 'addController'
                });
        })

        .controller('indexController', function ($scope, Users) {

        })

        .controller('addController', function ($scope, Users) {

        });

})(window, window.angular);