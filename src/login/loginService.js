;(function (window, angular) {
    var App = window.App;

    //// Modules requirement
    var crypto = require('crypto');

    angular.module('app.service.Login', ['app.Config'])

        .factory('Login', function ($q, Config) {
            var cf = Config.data;
            var dataFactory = {};
            var knex = require('knex')({
                client: 'mysql',
                connection: cf.db
            });

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
                            q.reject(err);
                        } else {
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
