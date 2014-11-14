;(function (window, angular) {

    angular.module('app.orders', [
        'ngRoute',
        'app.orders.MainController',
        'app.orders.NewController'])
        .config(function ($routeProvider) {
           $routeProvider
               .when('/', {
                   templateUrl: './partials/main.html',
                   controller: 'MainController',
                   controllerAs: 'mainCtrl'
               })
               .when('/new', {
                   templateUrl: './partials/new.html',
                   controller: 'NewController',
                   controllerAs: 'newCtrl'
               })
               .otherwise({
                   redirectTo: '/'
               });
        });

})(window, window.angular);