(function (window, angular) {
    'use strict';

    var Q = require('q');
        require('q-foreach')(Q);

    var moment = require('moment'),
        _ = require('lodash');

    angular.module('app.tools.ClosingController', [])
        .controller('ClosingController', function ($scope, $window, ClosingService) {

            var startDate = $window.sessionStorage.getItem('startDate'),
                endDate = $window.sessionStorage.getItem('endDate'),
                year = $window.sessionStorage.getItem('year');

            $scope.year = year;
            $scope.startDate = new Date(moment(startDate));
            $scope.endDate = new Date(moment(endDate));

            $scope.total = 0;
            $scope.current = 0;
            $scope.currentPercentText = '0%';

            $scope.isShowProgress = false;

            $scope.doClose = function () {

                // Check if this year has been closed
                ClosingService.checkClosed(year)
                    .then(function (resp) {
                        if (resp) {
                            // closed
                            swal({
                                title: 'เกิดข้อผิดพลาด',
                                text: 'ปีงบประมาณนี้ได้ถูกปิดไปแล้ว ไม่สามารถปิดได้อีก ' + '['+ year +']',
                                type: 'warning',
                                confirmButtonText: 'ตกลง'
                            });
                        } else {

                            $scope.isShowProgress = true;

                            ClosingService.setStartDate(startDate);
                            ClosingService.setEndDate(endDate);
                            ClosingService.setCloseDate(moment($scope.closeDate).format('YYYY-MM-DD'));

                            if (!$scope.closeDate) {
                                swal({
                                    title: 'เกิดข้อผิดพลาด',
                                    text: 'กรุณาระบุวันที่ต้องการปิดบัญชี',
                                    type: 'warning',
                                    confirmButtonText: 'ตกลง'
                                });
                            } else {
                                ClosingService.getBalance()
                                .then(function (rows) {

                                    $scope.total = _.size(rows);

                                    Q.forEach(rows, function (v) {
                                        var q = Q.defer();
                                        var total = v.total_in - v.total_out;

                                        ClosingService.doClose(v.icode, total)
                                        .then(function () {
                                            $scope.current++;
                                            $scope.currentPercentText = Math.floor($scope.current * 100 / $scope.total)+'%';
                                            q.resolve();
                                        }, function (err) {
                                            console.log(err);
                                        });

                                        return q.promise;

                                    }).then(function () {
                                        ClosingService.updateLog($scope.year);
                                        swal({
                                            title: 'เสร็จเรียบร้อย',
                                            text: 'ทำการปิดบัญชีเสร็จเรียบร้อยแล้ว',
                                            type: 'success',
                                            confirmButtonText: 'ตกลง'
                                        });
                                    });



                                });
                            }

                        }

                    });

            };

        });
})(window, window.angular);
