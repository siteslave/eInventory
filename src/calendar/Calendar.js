(function (window, angular) {

    'use strict';

    var events = require('events'),
        em = new events.EventEmitter();
        
      em.setMaxListeners(0);

    angular.module('app.calendar.Calendar', [
        'app.common.Config',
        'app.calendar.MainController',
        'app.calendar.MainService',
        'app.filters.Main'
    ]);

})(window, window.angular);
