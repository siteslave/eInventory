;(function (window, angular) {
    angular.module('app.orders.MainController', ['app.orders.MainService'])
        .controller('MainController', function ($scope, MainService) {

            $scope.orders = []; // all order list
            $scope.isProcessing = false;

            // get order list
            MainService.getOrders('N')
                .then(function (rows) {
                    $scope.orders = rows;
                }, function (err) {
                    console.log(err);
                });

            $scope.getList = function (isImported) {
                MainService.getOrders(isImported)
                .then(function (rows) {
                    $scope.orders = rows;
                }, function (err) {
                    console.log(err);
                });
            };
        });
})(window, window.angular);
