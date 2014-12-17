(function (window, angular) {

    'use strict';
    
    var events = require('events'),
        em = new events.EventEmitter();

      em.setMaxListeners(0);

    angular.module('app.reports.balance.Balance', [
        'app.common.Config',
        'cgBusy',
        'app.reports.balance.BalanceService',
        'app.reports.balance.BalanceController'
    ]);

})(window, window.angular);
