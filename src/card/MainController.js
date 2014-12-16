(function (window, angular) {
    'use strict';

    var moment = require('moment'),
        _ = require('lodash');

        require('moment-range')(moment);

    angular.module('app.card.MainController', [])
        .controller('MainController', function ($scope, $window, MainService) {

            $scope.minDate = $window.sessionStorage.getItem('startDate');
            $scope.maxDate = $window.sessionStorage.getItem('endDate');

            var trueStartDate = moment($scope.minDate, 'YYYY-MM-DD');
            var trueEndDate = moment($scope.maxDate, 'YYYY-MM-DD');

            $scope.range = moment().range(trueStartDate, trueEndDate);

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

                if ($scope.range.contains($scope.startDate) && $scope.range.contains($scope.endDate)) {
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
                } else {
                    // not in period
                    swal({
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ช่วงเวลาที่กำหนดไม่ได้อยู่ในปีงบประมาณ ปัจจุบัน ' + '['+$window.sessionStorage.getItem('year')+']',
                        type: 'warning',
                        confirmButtonText: 'ตกลง'
                    });
                }
            };

        });
})(window, window.angular);
