/**
 * Connection Service
 *
 * @author  Satit Rianpit <rianpit@gmail.com>
 * @since   Version 1.0.0
 * @license MIT
 * @alias   ConnectionService
 * @usage   Add 'app.connection.ConnectionService' to module dependency injection
 */
;(function () {

    'use strict';

    var jf = require('jsonfile');

    angular.module('app.connection.ConnectionService', [])
        .factory('ConnectionService', function ($q) {

            var q = $q.defer();

            return {
                // Save configure data to json file.
                saveConnection: function (config) {
                    try {
                        jf.writeFileSync(App.configFile, config);
                        q.resolve();
                    } catch (e) {
                        q.reject(e);
                    }

                    return q.promise;
                  }
            };
        });

})(window, window.angular);
