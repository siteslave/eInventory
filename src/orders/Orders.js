;(function (window, angular) {

    'use strict';

    var events = require('events'),
        em = new events.EventEmitter();

      em.setMaxListeners(0);

    angular.module('app.orders', [
        'ngRoute',
        'ui.select2',
        'app.common.Config',
        'app.filters.Main',
        'app.orders.MainController',
        'app.orders.NewController',
        'app.orders.EditController',
        'app.orders.NewService',
        'app.orders.MainService',
        'app.orders.EditService'
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
