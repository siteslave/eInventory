(function (window, angular) {

    'use strict';

    angular.module('app.reports.balance.BalanceService', [])

        .service('BalanceService', function ($q, Config) {
            var db = Config.getConnection();

            this.setStartDate = function (startDate) {
                this.startDate = startDate;
            };

            this.setEndDate = function (endDate) {
                this.endDate = endDate;
            };

            this.getBalance = function () {
                /*
                select d.icode, d.name,
                (select sum(qty_in) from stc_cards where icode=d.icode and cdate between '2013-10-01' and '2014-09-30') as qty_in,
                (select sum(qty_out) from stc_cards where icode=d.icode and cdate between '2013-10-01' and '2014-09-30') as qty_out
                from stc_drug_items as d

                */

                var q = $q.defer();

                // sub query 1
                var totalInQuery = db('stc_cards')
                    .sum('qty_in')
                    .whereRaw('icode=d.icode')
                    .whereBetween('cdate', [this.startDate, this.endDate])
                    .as('total_in');

                var totalOutQuery = db('stc_cards')
                    .sum('qty_out')
                    .whereRaw('icode=d.icode')
                    .whereBetween('cdate', [this.startDate, this.endDate])
                    .as('total_out');

                db('stc_drug_items as d')
                    .select('d.cost', 'd.price', 'd.units', 'd.icode', 'd.name', totalInQuery, totalOutQuery)
                    .orderBy('d.name')
                    //.toSQL();
                     .exec(function (err, rows) {
                         if (err) q.reject(err);
                         else q.resolve(rows);
                     });
                    //console.log(sql);

                return q.promise;
            };
        });

})(window, window.angular);
