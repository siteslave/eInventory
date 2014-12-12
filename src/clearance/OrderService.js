(function (window, angular) {
    'use strict';

    angular.module('app.clearance.OrderService', ['app.common.Config'])
        .factory('OrderService', function ($scope, Config) {

            var db = Config.getConnection();

            return {

            };

        });

})(window, window.angular);