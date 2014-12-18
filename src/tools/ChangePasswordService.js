(function (window, angular) {
    'use strict';

    angular.module('app.tools.ChangePasswordService', [])
        .factory('ChangePasswordService', function ($q, Config) {
            var db = Config.getConnection();

            return {
                doChangePassword: function (newPassword) {
                    var q = $q.defer();

                    db('stc_users')
                        .update({
                            password: newPassword
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                }
            };

        });
})(window, window.angular);
