(function (window, angular) {
    'use strict';

    angular.module('app.pages.IndexService', [])
        .factory('IndexService', function ($q, Config) {

                var db = Config.getConnection();

                return {

                    getTopByRight: function (startDate, endDate) {
                        var q = $q.defer();

                        db('stc_payments as p')
                            .select('pc.name', db.raw('count(distinct p.vn) as total'))
                            .innerJoin('stc_pttype as pt', 'pt.code', 'p.pttype')
                            .innerJoin('stc_pcode as pc', 'pc.code', 'pt.pcode')
                            .where('is_clearanced', 'Y')
                            .whereBetween('p.vstdate', [startDate, endDate])
                            .groupBy('pc.code')
                            .exec(function (err, rows) {
                                if (err) q.reject(err);
                                else q.resolve(rows);
                            });

                        return q.promise;
                    },

                    getTopPerVisit: function (startDate, endDate) {
                        var q = $q.defer();

                        db('stc_payments as p')
                            .select('d.name', db.raw('count(distinct p.vn) as total'))
                            .innerJoin('stc_drug_items as d', 'd.icode', 'p.icode')
                            .where('is_clearanced', 'Y')
                            .whereBetween('p.vstdate', [startDate, endDate])
                            .groupBy('p.icode')
                            .orderBy('total', 'desc')
                            .limit(5)
                            .exec(function (err, rows) {
                                if (err) q.reject(err);
                                else q.resolve(rows);
                            });

                        return q.promise;
                    },

                    getTopPerPrice: function (startDate, endDate) {
                        var q = $q.defer();

                        db('stc_payments as p')
                            .select('d.name', db.raw('sum(p.qty*p.price) as total'))
                            .innerJoin('stc_drug_items as d', 'd.icode', 'p.icode')
                            .where('is_clearanced', 'Y')
                            .whereBetween('p.vstdate', [startDate, endDate])
                            .groupBy('p.icode')
                            .orderBy('total', 'desc')
                            .limit(5)
                            .exec(function (err, rows) {
                                if (err) q.reject(err);
                                else q.resolve(rows);
                            });

                        return q.promise;
                    }
                };
        });


})(window, window.angular);
