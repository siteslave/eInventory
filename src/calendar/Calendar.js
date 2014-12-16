(function (window, angular) {

    'use strict';

    angular.module('app.calendar.Calendar', [
        'app.common.Config',
        'app.calendar.MainController',
        'app.calendar.MainService',
        'app.filters.Main'
    ]);

})(window, window.angular);
