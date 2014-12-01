(function (window, angular) {
    'use strict';

    var moment = require('moment'),
        _ = require('lodash'),
        gui = require('nw.gui'),
        win = gui.Window.get();

    angular.module('app.calendar.MainController', ['app.calendar.MainService'])
        .controller('MainController', function ($scope, $window, MainService) {

            $scope.peroid = [];
            $scope.showEdit = false;

            MainService.getPeriod()
                .then(function (rows) {
                    $scope.peroid = rows;
                }, function (err) {
                    console.log(err);
                });

            var updatePeriodScope = function (name, newStartDate, newEndDate) {
                var idx = _.findIndex($scope.peroid, {'name': name});

                $scope.peroid[idx].start_date = newStartDate;
                $scope.peroid[idx].end_date = newEndDate;
            };

            $scope.setEdit = function (name, startDate, endDate) {
                $scope.startDate = startDate;
                $scope.endDate = endDate;
                $scope.name = name;

                $scope.showEdit = true;
            };

            $scope.savePeriod = function () {

                var startDate = moment($scope.startDate).format('YYYY-MM-DD'),
                    endDate = moment($scope.endDate).format('YYYY-MM-DD'),
                    name = $scope.name;

                MainService.savePeriod(name, startDate, endDate)
                    .then(function () {
                        $scope.showEdit = false;
                        updatePeriodScope(name, startDate, endDate);
                    }, function (err) {
                        console.log(err);
                    });

            };

            $scope.closeEdit = function () {
                $scope.showEdit = false;
            };
        });

})(window, window.angular);