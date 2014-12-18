;(function (window, angular) {

    'use strict';

    angular.module('app.import.MSKHController', [])
        .controller('MSKHController', function ($scope, $window, MSKHService) {

            $scope.tab = 0;

            $scope.setTab = function (tab) {
                $scope.tab = tab;
            };

            $scope.doImportStanddardCode = function () {};

        });

})(window, window.angular);
