(function (window, angular) {

    'use strict';
    
    var events = require('events'),
        em = new events.EventEmitter();

      em.setMaxListeners(0);

    angular.module('app.products.Product', [
        'ngRoute',
        'app.common.Config',
        'app.products.MainController',
        'app.products.DetailController',
        'app.products.MainService',
        'app.products.DetailService'
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
