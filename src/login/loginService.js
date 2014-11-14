;(function (window, angular) {
    var App = window.App;

    //// Modules requirement
    var jf = require('jsonfile'),
        crypto = require('crypto');

    // Get configuration
    var config = jf.readFileSync(App.configFile);
    // MySQL connection setting
    var knex = require('knex')({
        client: 'mysql',
        connection: config.db
    });

    angular.module('app.service.Login', [])

        .factory('Login', function ($q) {

            var dataFactory = {};

            dataFactory.checkAuth = function (username, password) {
                var q = $q.defer();
                // password encryption
                var hash = crypto.createHmac('sha256', App.saltKey).update(password).digest('base64');
                //console.log(hash);
                knex('stc_users')
                    .where('username', username)
                    .where('password', hash)
                    .count('* as total')
                    .exec(function (err, rows) {
                        if (err) {
                            console.log(err);
                            q.reject(err);
                        } else {
                            console.log(rows);
                            if (rows[0].total) {
                                return q.resolve(true);
                            } else {
                                return q.resolve(false);
                            }
                        }
                    });

                return q.promise;
            };

            return dataFactory;
        });

})(window, window.angular);
