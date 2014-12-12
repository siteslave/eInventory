(function (window, angular) {
    'use strict';

    angular.module('app.card.MainService', ['app.common.Config'])
        .factory('MainService', function ($q, Config) {

            var db = Config.getConnection();

            return {
                getDrugs: function () {
                    var q = $q.defer();

                    db('stc_drug_items')
                        .select('icode', 'name')
                        .orderBy('name')
                        .exec(function (err, rows) {

                            if (err) q.reject(err);
                            else q.resolve(rows);

                        });

                    return q.promise;
                },

                getStockCard: function (icode, startDate, endDate) {

                    var q = $q.defer();

                    db('stc_cards')
                        .where('icode', icode)
                        .whereBetween('cdate', [startDate, endDate])
                        .orderBy('cdate', 'asc')
                        .exec(function (err, rows) {

                            if (err) q.reject(err);
                            else q.resolve(rows);

                        });

                    return q.promise;

                }
            };
    });

})(window, window.angular);