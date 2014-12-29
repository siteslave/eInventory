;(function (window, angular) {
    var App = window.App;

    //// Modules requirement
    var crypto = require('crypto');

    angular.module('app.login.LoginService', ['app.common.Config'])

        .factory('Login', function ($q, Config) {
            var db = Config.getConnection();

            return {
                checkAuth: function (username, password) {
                    var q = $q.defer();
                    // password encryption
                    var hash = crypto.createHmac('sha256', App.saltKey)
                        .update(password)
                        .digest('base64');

                    db('stc_users')
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
                },

                getPeriod: function () {
                    var q = $q.defer();

                    db('stc_period')
                        .select('name')
                        .orderBy('name')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                },

                getPeriodRange: function (period) {
                    var q = $q.defer();

                    db('stc_period')
                        .select('start_date', 'end_date')
                        .where('name', period)
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows[0]);
                        });

                    return q.promise;
                }
            };

        });

})(window, window.angular);
