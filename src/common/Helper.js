;(function (window, angular) {

    'use strict';

    angular.module('app.common.Helper', [])
        .factory('Helper', function () {
            return {
                clearNull: function (str) {
                    return !str ? '-' : str;
                }
            };
        });

})(window, window.angular);
