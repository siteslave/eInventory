(function (window, angular) {
    'use strict';

    var moment = require('moment'),
        _ = require('lodash');

    angular.module('app.clearance.PaymentController', ['app.clearance.PaymentService'])
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
                        
                        _.forEach(rows, function (v) {
                            PaymentService.saveToStockCard(v)
                                .then(function () {
                                    PaymentService.updateClearanceStatus(v.guid)
                                        .then(function () {
                                            $scope.isWatting = false;
                                            $scope.paymentCurrentImported++;
                                            $scope.paymentImportedPercent = Math.floor($scope.paymentCurrentImported * 100 / $scope.paymentTotal) + '%';

                                            // update stock qty
                                            PaymentService.updateStockQty(v.icode, v.qty);
                                        }, function (err) {
                                            console.log(err);
                                        });
                                }, function (err) {
                                    console.log(err);
                                });
                        });

                        _.remove($scope.payments, { id: id });

                        PaymentService.updateImportedStatus(id);
                       
                    }, function (err) {
                        console.log(err);
                    });
            };
        });

})(window, window.angular);