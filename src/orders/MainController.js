(function (window, angular) {
    angular.module('app.orders.MainController', [])
        .controller('MainController', function ($scope, $window, MainService) {

            $scope.orders = []; // all order list
            $scope.isProcessing = false;

            $scope.startDate = $window.sessionStorage.getItem('startDate');
            $scope.endDate = $window.sessionStorage.getItem('endDate');

            // get order list
            MainService.getOrders('N', $scope.startDate, $scope.endDate)
                .then(function (rows) {
                    $scope.orders = rows;
                }, function (err) {
                    console.log(err);
                });

            $scope.getList = function (isImported) {

                MainService.getOrders(isImported, $scope.startDate, $scope.endDate)
                .then(function (rows) {
                    $scope.orders = rows;
                }, function (err) {
                    console.log(err);
                });
            };
        });
})(window, window.angular);
