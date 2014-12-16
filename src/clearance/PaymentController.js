(function (window, angular) {
    'use strict';

    var moment = require('moment'),
        _ = require('lodash');

    var Q = require('q');
    require('q-foreach')(Q);

    angular.module('app.clearance.PaymentController', [])
        .controller('PaymentController', function ($scope, PaymentService) {

            $scope.payments = [];

            PaymentService.getPaymentLog()
                .then(function (rows) {
                    $scope.payments = rows;
                }, function (err) {
                    console.log(err);
                    alert('Error: View console to see log');
                });

            $scope.doRemove = function (id, startDate, endDate) {

                var _startDate = moment(startDate).format('YYYY-MM-DD'),
                    _endDate = moment(endDate).format('YYYY-MM-DD');

                PaymentService.removePaymentLog(id)
                    .then(function () {
                        return PaymentService.removePayment(_startDate, _endDate);
                    })
                    .then(function () {
                        _.remove($scope.payments, { id: id });
                    }, function (err) {
                        console.log(err);
                        alert('Error: View console to see log');
                    });
            };

            /**
            * Import data
            */
            $scope.paymentImportedPercent = '0%';
            $scope.paymentCurrentImported = 0;
            $scope.paymentTotal = 0;
            $scope.isWatting = false;

            $scope.doImport = function (id, startDate, endDate) {
                var _startDate = moment(startDate).format('YYYY-MM-DD'),
                    _endDate = moment(endDate).format('YYYY-MM-DD');

                $scope.isWatting = true;
                $scope.paymentImportedPercent = '0%';
                $scope.paymentCurrentImported = 0;

                // get all payments
                PaymentService.getPayments(_startDate, _endDate)
                    .then(function (rows) {
                        // total rows
                        $scope.paymentTotal = _.size(rows);

                        PaymentService.updateImportedStatus(id);
                        _.remove($scope.payments, { id: id });

                        Q.forEach(rows, function (v) {

                            var defer = Q.defer();
                            var promise = PaymentService.saveToStockCard(v);

                            // promise.then(function () {
                            //     return PaymentService.updateStockQty(v.icode, v.qty);
                            // })
                            //
                            promise.then(function () {
                                $scope.isWatting = false;
                                $scope.paymentCurrentImported++;
                                $scope.paymentImportedPercent =
                                    Math.floor($scope.paymentCurrentImported * 100 / $scope.paymentTotal) + '%';
                                return PaymentService.updateClearanceStatus(v.guid);
                            })
                            .then(function () {
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
                                timer: 1000
                            });

                        });

                    }, function (err) {
                        console.log(err);
                    });
            };
        });

})(window, window.angular);
