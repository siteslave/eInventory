(function (window, angular) {
    'use strict';

    angular.module('app.products.DetailService', ['app.common.Config'])
        .factory('DetailService', function ($q, Config) {

            var db = Config.getConnection();

            return {

                getDetail: function (icode) {

                    var q = $q.defer();

                    db('stc_drug_items')
                        .where('icode', icode)
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows[0]);
                        });

                    return q.promise;
                },

                doUpdate: function (icode, min_qty) {
                    var q = $q.defer();

                    db('stc_drug_items')
                        .where('icode', icode)
                        .update({
                            min_qty: min_qty
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