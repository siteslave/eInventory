(function (window, angular) {

    'use strict';

    angular.module('app.calendar.MainService', ['app.common.Config'])
        .factory('MainService', function ($q, Config) {

            var db = Config.getConnection();

            return {
                savePeriod: function (name, startDate, endDate) {
                    var q = $q.defer();

                    db('stc_period')
                        .where('name', name)
                        .update({
                            start_date: startDate,
                            end_date: endDate
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                getPeriod: function () {
                    var q = $q.defer();

                    db('stc_period')
                        .select('name', 'start_date', 'end_date')
                        .orderBy('name')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                }
            };
        });

})(window, window.angular);