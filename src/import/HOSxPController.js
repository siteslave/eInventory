;(function (window, angular) {

    'use strict';

    var _ = require('lodash'),
        moment = require('moment');

    var Q = require('q');
    require('q-foreach')(Q);

    angular.module('app.import.HOSxPController', [
        'app.import.HOSxPService',
        'app.import.ImportDirective'
        ])
        .controller('HOSxPController', function ($scope, HOSxPService) {

            $scope.tab = 0;

            $scope.setTab = function (tab) {
                $scope.tab = tab;
            };

            $scope.payments = 0;
            $scope.totalPayment = 0;
            $scope.currentImportPayment = 0;
            $scope.importedPaymentPercent = '0%';

            $scope.totalDrug = 0;
            $scope.currentImportDrug = 0;
            $scope.importedPercent = '0%';
            //Right
            $scope.totalRight = 0;
            $scope.currentImportRight = 0;
            $scope.importedRightPercent = '0%';

            $scope.paymentIsImported = true;

            $scope.doImportRight = function () {
                $scope.totalRight = 0;
                $scope.currentImportRight = 0;
                $scope.importedRightPercent = '0%';
                $scope.rights = null;

                HOSxPService.getHOSxPRight()
                    .then(function (rows) {
                        $scope.totalRight = _.size(rows);
                        $scope.rights = rows;
                        return HOSxPService.removeRight();
                    })
                    .then(function () {

                        Q.forEach($scope.rights, function (v) {
                            var defer = Q.defer();
                            // import pttype
                            HOSxPService.importRight(v)
                                .then(function () {
                                    $scope.currentImportRight++;
                                    $scope.importedRightPercent = Math.floor($scope.currentImportRight * 100 / $scope.totalRight)+'%';
                                    defer.resolve();
                                }, function (err) {
                                    defer.reject(err);
                                    console.log(err);
                                });

                            return defer.promise;
                        })
                        .then(function () {
                            swal({
                                title: 'สำเร็จ',
                                text: 'นำเข้าข้อมูลเสร็จเรียบร้อยแล้ว',
                                type: 'success',
                                confirmButtonText: 'ตกลง',
                                timer: 1500
                            });
                        });

                    }, function (err) {
                        console.log(err);
                        alert('Error [Import Right], see console');
                    });
            };

            $scope.doImportDrug = function () {

                $scope.totalDrug = 0;
                $scope.currentImportDrug = 0;
                $scope.importedPercent = '0%';

                var promise = HOSxPService.getHOSxPDrug();
                promise.then(function(data) {
                    $scope.totalDrug = _.size(data);

                    Q.forEach(data, function (v) {
                        var defer = Q.defer();
                        // get duplicated
                        HOSxPService.checkDuplicated(v.icode)
                            .then(function (isDuplicated) {
                                if (isDuplicated) {
                                    HOSxPService.doUpdateDrug(v)
                                        .then(function () {
                                            $scope.currentImportDrug++;
                                            $scope.importedPercent = Math.floor($scope.currentImportDrug * 100 / $scope.totalDrug)+'%';
                                            //console.log($scope.importedPercent);
                                        }, function (err) {
                                            defer.reject(err);
                                            console.log(err);
                                        });
                                } else {
                                    HOSxPService.doImportDrug(v)
                                        .then(function () {
                                            $scope.currentImportDrug++;
                                            $scope.importedPercent = Math.floor($scope.currentImportDrug * 100 / $scope.totalDrug)+'%';
                                            //console.log($scope.importedPercent);
                                        }, function (err) {
                                            defer.reject(err);
                                            console.log(err);
                                        });
                                }

                                defer.resolve();

                            }, function (err) {
                                console.log(err);
                                defer.reject(err);
                            });

                            return defer.promise;
                    })
                    .then(function () {
                        // success
                        swal({
                            title: 'สำเร็จ',
                            text: 'นำเข้าข้อมูลเสร็จเรียบร้อยแล้ว',
                            type: 'success',
                            confirmButtonText: 'ตกลง',
                            timer: 1500
                        });
                    });
                })
                    .then(function () {
                    }, function (err) {
                        console.log(err);
                        alert('Error: See console to view log.');
                    });
            };

            $scope.doImportPayment = function () {

                // get payment
                var startDate = moment($scope.startDate).format('YYYY-MM-DD'),
                    endDate = moment($scope.endDate).format('YYYY-MM-DD');

                $scope.paymentIsImported = false;

                $scope.payments = 0;
                $scope.totalPayment = 0;
                $scope.currentImportPayment = 0;
                $scope.importedPaymentPercent = '0%';

                // check duplicated log
                var promise = HOSxPService.checkDuplicatedPaymentLog(startDate, endDate);
                promise.then(function (isDuplicated) {
                    if (isDuplicated) {

                        swal({
                            title: "Are you sure?",
                            text: "รายการนี้เคยนำเข้าระบบแล้ว ต้องการนำเข้าอีกหรือไม่?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "ใช่, ฉันต้องการนำเข้า!",
                            cancelButtonText: 'ยกเลิก',
                            closeOnConfirm: true
                        }, function () {
                            importPayment(startDate, endDate);
                        });

                        $scope.paymentIsImported = true;

                    } else {
                        HOSxPService.savePaymentLog(startDate, endDate)
                            .then(function () {
                                importPayment(startDate, endDate);
                            }, function (err) {
                                console.log('[Insert log]: ' + err);
                                alert('Error [Insert log]: Please see error in console');
                            });
                    }
                }, function (err) {
                    console.log(err);
                    alert('Error: View console to see log');
                });

            };

            var importPayment = function (startDate ,endDate) {

                HOSxPService.getHOSxPDrugPayment(startDate, endDate)
                    .then(function (rows) {
                        $scope.paymentIsImported = true;
                        $scope.totalPayment = _.size(rows);
                        $scope.payments = rows;

                        Q.forEach(rows, function (v) {
                            var defer = Q.defer();

                            HOSxPService.importDrugPayment(v)
                                .then(function() {
                                    $scope.currentImportPayment++;
                                    $scope.importedPaymentPercent = Math.floor(($scope.currentImportPayment * 100) / $scope.totalPayment)+'%';
                                    defer.resolve();
                                }, function (err) {
                                    defer.reject(err);
                                    console.log(err);
                                });

                            return defer.promise;
                        })
                        .then(function () {
                            swal({
                                title: 'สำเร็จ',
                                text: 'นำเข้าข้อมูลเสร็จเรียบร้อยแล้ว',
                                type: 'success',
                                confirmButtonText: 'ตกลง',
                                timer: 1500
                            });
                        });

                    }, function (err) {
                        console.log(err);
                        alert('Error [Import payment]: Please see error in console');
                    });

            };
        });

})(window, window.angular);
