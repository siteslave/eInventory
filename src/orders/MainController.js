;(function (window, angular) {
    angular.module('app.orders.MainController', ['app.orders.MainService'])
        .controller('MainController', function ($scope, MainService) {

            $scope.orders = []; // all order list
            $scope.isProcessing = false;

            // get order list
            MainService.getOrders()
                .then(function (rows) {
                    $scope.orders = rows;
                }, function (err) {
                    console.log(err);
                });

            $scope.doProcess = function (orderId) {
                $scope.isProcessing = true;

            };
        });
})(window, window.angular);
