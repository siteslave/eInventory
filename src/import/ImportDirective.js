;(function (window, angular) {

    'use strict';

    angular.module('app.import.ImportDirective', [])
        .directive('myProgressbar', function () {
           return {
               restrict: 'E',
               template: '<div class="progress">' +
               '<div class="progress-bar progress-bar-success" role="progressbar" ng-style="{\'width\': importedPercent}">{{importedPercent}}</div>' +
               '</div>'
           };
        })
        .directive('myProgressbarPayment', function () {
           return {
               restrict: 'E',
               template: '<div class="progress">' +
               '<div class="progress-bar progress-bar-success" role="progressbar" ng-style="{\'width\': importedPaymentPercent}">{{importedPaymentPercent}}</div>' +
               '</div>'
           };
        })
        .directive('myProgressbarStanddardCode', function () {
           return {
               restrict: 'E',
               template: '<div class="progress">' +
               '<div class="progress-bar progress-bar-success" role="progressbar" ng-style="{\'width\': importedPaymentPercent}">{{importedPaymentPercent}}</div>' +
               '</div>'
           };
        })
        .directive('myProgressbarPttype', function () {
           return {
               restrict: 'E',
               template: '<div class="progress">' +
               '<div class="progress-bar progress-bar-success" role="progressbar" ng-style="{\'width\': importedRightPercent}">{{importedRightPercent}}</div>' +
               '</div>'
           };
        });

})(window, window.angular);