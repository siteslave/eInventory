;(function (window, angular) {

    'use strict';

    var _ = require('lodash'),
        moment = require('moment');

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

                        _.forEach($scope.rights, function (v) {
                            // import pttype
                            HOSxPService.importRight(v)
                                .then(function () {
                                    $scope.currentImportRight++;
                                    $scope.importedRightPercent = Math.floor($scope.currentImportRight * 100 / $scope.totalRight)+'%';
                                }, function (err) {
                                    console.log(err);
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

                    _.forEach(data, function (v) {
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
                                            console.log(err);
                                            alert('Error [UPDATE]: Please see console.');
                                        });
                                } else {
                                    HOSxPService.doImportDrug(v)
                                        .then(function () {
                                            $scope.currentImportDrug++;
                                            $scope.importedPercent = Math.floor($scope.currentImportDrug * 100 / $scope.totalDrug)+'%';
                                            //console.log($scope.importedPercent);
                                        }, function (err) {
                                            console.log(err);
                                        });
                                }
                            }, function (err) {
                                console.log(err);
                                alert('Error [CHECK DUPLICATED]: Please see console.');
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

                $scope.payments = 0;
                $scope.totalPayment = 0;
                $scope.currentImportPayment = 0;
                $scope.importedPaymentPercent = '0%';

                HOSxPService.getHOSxPDrugPayment(startDate, endDate)
                    .then(function (rows) {
                        $scope.totalPayment = _.size(rows);
                        $scope.payments = rows;

                        // remove old data
                        return HOSxPService.removeDrugPayment(startDate, endDate);
                    })
                    .then(function () {
                        _.forEach($scope.payments, function (v) {
                           HOSxPService.importDrugPayment(v)
                               .then(function() {
                                   $scope.currentImportPayment++;
                                   $scope.importedPaymentPercent = Math.floor(($scope.currentImportPayment * 100) / $scope.totalPayment)+'%';
                               }, function (err) {
                                   console.log(err);
                               });
                        });
                    }, function (err) {
                        console.log(err);
                        alert('Error [Import payment]: Please see error in console');
                    });

            };
        });

})(window, window.angular);