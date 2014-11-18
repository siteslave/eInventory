;(function (window, angular) {

    'use strict';

    angular.module('app.common.Helper', [])
        .factory('Helper', function () {
            return {

                getUrlParam: function (param) {
                    var pageUrl = window.location.search.substring(1),
                        urlVal = pageUrl.split('&');

                    for (var i = 0; i < urlVal.length; i++) {
                        var sParamName = urlVal[i].split('=');
                        if (sParamName[0] == param) return sParamName[1];
                    }
                },

                clearNull: function (str) {
                    return !str ? '-' : str;
                }
            };
        });

})(window, window.angular);