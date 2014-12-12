(function (window, angular) {
    'use strict';

    var moment = require('moment'),
        _ = require('lodash');

    angular.module('app.card.MainController', ['app.card.MainService'])
        .controller('MainController', function ($scope, MainService) {

            $scope.select2Options = {
                allowClear: true
            };

            $scope.totalQtyIn = 0;
            $scope.totalQtyOut = 0;
            $scope.totalQty = 0;
            
            MainService.getDrugs()
                .then(function (rows) {
                    $scope.drugs = rows;
                }, function (err) {
                    console.log(err);
                });

            $scope.doFilter = function () {

                $scope.totalQtyIn = 0;
                $scope.totalQtyOut = 0;
                $scope.totalQty = 0;

                // get stock card
                var _startDate = moment($scope.startDate).format('YYYY-MM-DD'),
                    _endDate = moment($scope.endDate).format('YYYY-MM-DD');

                MainService.getStockCard($scope.drug, _startDate, _endDate)
                    .then(function (rows) {
                        var data = [];
                        var currentTotal = 0;

                        _.each(rows, function (v) {
                            currentTotal += v.qty_in;
                            currentTotal -= v.qty_out;
                            $scope.totalQtyIn += v.qty_in;
                            $scope.totalQtyOut += v.qty_out;

                            var obj = {
                                cdate: v.cdate,
                                ccode: v.ccode,
                                cname: v.cname,
                                qty_in: v.qty_in,
                                qty_out: v.qty_out,
                                current_total: currentTotal,
                                is_get: v.qty_in > 0
                            };

                            data.push(obj);
                        });

                        $scope.totalQty = $scope.totalQtyIn - $scope.totalQtyOut;
                        $scope.cards = data;

                    }, function (err) {
                        console.log(err);
                    });

            };
                
        });
})(window, window.angular);