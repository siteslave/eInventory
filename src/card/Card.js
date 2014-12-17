(function (window, angular) {
    'use strict';

    var events = require('events'),
        em = new events.EventEmitter();

      em.setMaxListeners(0);

    angular.module('app.card.Card', [
        'ui.select2',
        'app.common.Config',
        'app.filters.Main',
        'app.card.MainController',
        'app.card.MainService'
    ]);

})(window, window.angular);
