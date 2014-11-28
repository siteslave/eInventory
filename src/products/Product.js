;(function (window, angular) {
    'use strict';

    angular.module('app.products.Product', [
        'ngRoute',
        'app.products.MainController',
        'app.products.DetailController'
    ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'partials/Main.html',
                    controller: 'MainController'
                })
                .when('/detail/:icode', {
                    templateUrl: 'partials/Detail.html',
                    controller: 'DetailController'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });

})(window, window.angular);