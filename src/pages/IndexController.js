(function (window, angular) {

    'use strict';

    var _ = require('lodash');

    angular.module('app.pages.IndexController', ['highcharts-ng'])
        .controller('IndexController', function ($scope, $window, IndexService) {

            $scope.year = $window.sessionStorage.getItem('year');
            $scope.startDate = $window.sessionStorage.getItem('startDate');
            $scope.endDate = $window.sessionStorage.getItem('endDate');

            $scope.visits = [];
            $scope.itemsPrice = [];

            IndexService.getTopPerVisit($scope.startDate, $scope.endDate)
                .then(function (rows) {
                    $scope.visits = rows;
                }, function (err) {
                    console.log(err);
                });


            IndexService.getTopPerPrice($scope.startDate, $scope.endDate)
                .then(function (rows) {
                    $scope.itemsPrice = rows;
                }, function (err) {
                    console.log(err);
                });

            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'column'
                    }
                },

                series: [
                    {
                        data: [],
                        name: 'ครั้ง',
                        dataLabels: { enabled: true }
                    }
                ],

                title: {
                    text: 'จำนวนครั้งการจ่ายยาแยกตามสิทธิ์การรักษา'
                },
                xAxis: {
                    title: {
                        text: 'รายการ'
                    },
                    categories: [],
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'ครั้ง'
                    }
                },

                legend: {
                    enabled: false
                }
            };


            IndexService.getTopByRight($scope.startDate, $scope.endDate)
                .then(function (rows) {

                    $scope.rights = rows;

                    _.forEach(rows, function (v) {
                        $scope.chartConfig.series[0].data.push(v.total);
                        $scope.chartConfig.xAxis.categories.push(v.name);
                    });

                }, function (err) {
                    console.log(err);
                });

        });

})(window, window.angular);
