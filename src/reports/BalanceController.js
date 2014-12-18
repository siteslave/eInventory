(function (window, angular) {

    'use strict';

    var _ = require('lodash');

    angular.module('app.reports.balance.BalanceController', [])

        .controller('BalanceController', function ($scope, $window, BalanceService) {

            var startDate = $window.sessionStorage.getItem('startDate');
            var endDate = $window.sessionStorage.getItem('endDate');

            BalanceService.setStartDate(startDate);
            BalanceService.setEndDate(endDate);

            $scope.promise = BalanceService.getBalance();

            $scope.promise
                .then(function (rows) {
                    //$scope.products = rows;
                    var data = [];

                    _.forEach(rows, function (v) {
                        var obj = {};
                        obj.name = v.name;
                        obj.icode = v.icode;
                        obj.units = v.units;
                        obj.cost = v.cost;
                        obj.price = v.price;
                        obj.total_in = v.total_in;
                        obj.total_out = v.total_out;
                        obj.total = v.total_in - v.total_out;

                        data.push(obj);
                    });

                    $scope.products = data;

                }, function (err) {
                    console.log(err);
                });

            $scope.getAll = function () {
                $scope.promise = BalanceService.getBalance();

                $scope.promise
                .then(function (rows) {
                    //$scope.products = rows;
                    var data = [];

                    _.forEach(rows, function (v) {
                        var obj = {};
                        obj.name = v.name;
                        obj.icode = v.icode;
                        obj.units = v.units;
                        obj.cost = v.cost;
                        obj.price = v.price;
                        obj.total_in = v.total_in;
                        obj.total_out = v.total_out;
                        obj.total = v.total_in - v.total_out;

                        data.push(obj);
                    });

                    $scope.products = data;

                }, function (err) {
                    console.log(err);
                });
            };


            $scope.getFilter = function () {
                $scope.promise = BalanceService.getBalance();

                $scope.promise
                .then(function (rows) {
                    //$scope.products = rows;
                    var data = [];

                    _.forEach(rows, function (v) {
                        var obj = {};
                        obj.name = v.name;
                        obj.icode = v.icode;
                        obj.units = v.units;
                        obj.cost = v.cost;
                        obj.price = v.price;
                        obj.total_in = v.total_in;
                        obj.total_out = v.total_out;
                        obj.total = v.total_in - v.total_out;

                        if (obj.total <= $scope.qtyQuery) data.push(obj);
                    });

                    $scope.products = data;

                }, function (err) {
                    console.log(err);
                });
            };

        });

})(window, window.angular);
