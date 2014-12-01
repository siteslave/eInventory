(function (window, angular) {

    'use strict';

    angular.module('app.products.DetailController', ['app.products.DetailService'])
        .controller('DetailController', function ($scope, $routeParams, DetailService) {
            //console.log($routeParams);

            $scope.isError = false;
            $scope.isSuccess = false;

            DetailService.getDetail($routeParams.icode)
                .then(function (rows) {
                    $scope.drug = rows;
                }, function (err) {
                    console.log(err);
                });

            $scope.doUpdate = function () {
                DetailService.doUpdate($scope.drug.icode, $scope.drug.min_qty)
                    .then(function () {
                        $scope.isError = false;
                        $scope.isSuccess = true;
                    }, function (err) {
                        $scope.isError = true;
                        $scope.isSuccess = false;
                        console.log(err);
                    });
            };
        });

})(window, window.angular);