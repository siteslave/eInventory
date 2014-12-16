(function (window, angular) {
    'use strict';

    angular.module('app.card.Card', [
        'ui.select2',
        'app.filters.Main',
        'app.card.MainController',
        'app.card.MainService'
    ]);

})(window, window.angular);
