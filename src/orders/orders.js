;(function (window, angular) {

    'use strict';

    angular.module('app.orders', [
        'ngRoute',
        'ui.select2',
        'app.filters.Main',
        'app.orders.MainController',
        'app.orders.NewController',
        'app.orders.EditController'
    ])
        .config(function ($routeProvider) {
           $routeProvider
               .when('/', {
                   templateUrl: './partials/Main.html',
                   controller: 'MainController'
               })
               .when('/new', {
                   templateUrl: './partials/New.html',
                   controller: 'NewController'
               })
               .when('/edit/:id', {
                   templateUrl: './partials/Edit.html',
                   controller: 'EditController'
               })
               .otherwise({
                   redirectTo: '/'
               });
        });

})(window, window.angular);
