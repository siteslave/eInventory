;(function (window, angular) {

    'use strict';

    angular.module('app.import', [
        'ngRoute',
        'app.import.HOSxPController',
        'app.import.MSKHController'
    ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: './partials/HOSxP.html',
                    controller: 'HOSxPController',
                    controllerAs: 'hos'
                })
                .when('/mskh', {
                    templateUrl: './partials/MSKH.html',
                    controller: 'MSKHController',
                    controllerAs: 'mskh'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });

})(window, window.angular);