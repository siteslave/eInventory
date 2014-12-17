(function (window, angular) {

    'use strict';

    var events = require('events'),
        em = new events.EventEmitter();

      em.setMaxListeners(0);

    angular.module('app.pages.Index', [
        'app.common.Config',
        'app.filters.Main',
        'highcharts-ng',
        'app.pages.IndexController',
        'app.pages.IndexService'
    ]);

})(window, window.angular);
