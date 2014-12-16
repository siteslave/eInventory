(function (window, angular) {

    var _ = require('lodash');

    angular.module('app.stock.MainController', [])
        .controller('MainController', function ($scope, MainService) {

            // Set stock list
            $scope.stocks = [];
            $scope.stockCode = null;
            $scope.stockName = null;
            $scope.stockId = null;
            $scope.isUpdaet = false;

            $scope.tab = 0;

            $scope.setTab = function (tab) {
                $scope.tab = tab;

                if (tab == 1) $scope.clearForm();
            };

            $scope.getList = function () {
                // Get stock list
                MainService.getList()
                .then(function (rows) {
                    $scope.stocks = rows;
                }, function (err) {
                    console.log(err);
                    alert('Error: View console to see log');
                });
            };

            // Save stock
            $scope.doSave = function () {
                if ($scope.isUpdate) {
                    // update
                    MainService.doUpdate($scope.stockId, $scope.stockName)
                        .then(function () {
                            $scope.getList();
                            $scope.clearForm();
                        }, function (err) {
                            console.log(err);
                            alert('Error: View console to see log');
                        });
                } else {
                    // insert
                    MainService.doInsert($scope.stockCode, $scope.stockName)
                        .then(function () {
                            $scope.getList();
                            $scope.clearForm();
                        }, function (err) {
                            console.log(err);
                            alert('Error: View console to see log');
                        });
                }
            };

            // Remove
            $scope.doRemove = function (id) {
                MainService.doRemove(id)
                    .then(function () {
                        _.remove($scope.stocks, {id: id});
                    }, function (err) {
                        console.log(err);
                        alert('Error: View console to see log');
                    });
            };

            // Set data for edit
            $scope.setEdit = function (id, code, name) {
                $scope.stockCode = code;
                $scope.stockName = name;
                $scope.stockId = id;
                $scope.isUpdate = true;

                $scope.tab = 1;
            };

            $scope.clearForm = function () {
                $scope.stockCode = null;
                $scope.stockName = null;
                $scope.stockId = null;
                $scope.isUpdate = false;
            };

            // Get suppliers list
            $scope.getList();

        });

})(window, window.angular);
