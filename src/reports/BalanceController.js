(function (window, angular) {

    'use strict';

    angular.module('app.reports.balance.BalanceController', [])

        .controller('BalanceController', function ($scope, $window, BalanceService) {

            var startDate = $window.sessionStorage.getItem('startDate');
            var endDate = $window.sessionStorage.getItem('endDate');

            BalanceService.setStartDate(startDate);
            BalanceService.setEndDate(endDate);

            $scope.promise = BalanceService.getBalance();

            $scope.promise
                .then(function (rows) {
                    $scope.products = rows;
                }, function (err) {
                    console.log(err);
                });

        });

})(window, window.angular);
