;(function (window, angular) {

    'use strict';

    angular.module('app.import.MSKHController', ['app.import.MSKHService'])
        .controller('MSKHController', function ($scope, MSKHService) {

            $scope.tab = 0;

            $scope.setTab = function (tab) {
                $scope.tab = tab;
            };

            $scope.doImportStanddardCode = function () {};

        });

})(window, window.angular);