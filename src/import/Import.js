;(function (window, angular) {

    'use strict';

    var events = require('events'),
        em = new events.EventEmitter();

      em.setMaxListeners(0);

    angular.module('app.import', [
        'ngRoute',
        'app.common.Config',
        'app.import.HOSxPController',
        'app.import.MSKHController',
        'app.import.HOSxPService',
        'app.import.MSKHService',
        'app.import.ImportDirective'
    ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: './partials/HOSxP.html',
                    controller: 'HOSxPController'
                })
                .when('/mskh', {
                    templateUrl: './partials/MSKH.html',
                    controller: 'MSKHController'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });

})(window, window.angular);
