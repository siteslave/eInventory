(function (window, angular) {
    'use strict';

    angular.module('app.products.MainService', ['app.common.Config'])
        .factory('MainService', function ($q, Config) {
            var db = Config.getConnection();

            return {

                getDrug: function () {
                    var q = $q.defer();

                    db('stc_drug_items')
                        .orderBy('name', 'asc')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                }
            };
        });

})(window, window.angular);