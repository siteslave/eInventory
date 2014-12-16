(function (window, angular) {

    'use strict';

    angular.module('app.products.MainController', [])
        .controller('MainController', function ($scope, MainService) {

            $scope.drugs = [];

            MainService.getDrug()
                .then(function (rows) {
                    $scope.drugs = rows;
                }, function (err) {
                    console.log(err);
                    alert('Error [GET DRUG]: View log to see error.');
                });
        });

})(window, window.angular);
