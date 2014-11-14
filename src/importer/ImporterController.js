;(function (window, angular) {

    angular.module('app.controller.Importer', [])
        .controller('ImporterController', function ($scope, Importer) {

            $scope.suppliers = [];
            // Get suppliers
            Importer.getSuppliers()
                .then(function (rows) {
                    $scope.suppliers = rows;
                }, function (err) {
                    console.log(err);
                })
        });

})(window, window.angular);