(function (window, angular) {
    'use strict';

    angular.module('app.clearance.Clearance', [
        'ngRoute',
        'app.filters.Main',
        'app.clearance.OrderController',
        'app.clearance.PaymentController'
    ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'partials/Order.html',
                    controller: 'OrderController'
                })
                .when('/payment', {
                    templateUrl: 'partials/Payment.html',
                    controller: 'PaymentController'
                })
                .otherwise({ redirectTo: '/' });
        });

})(window, window.angular);
