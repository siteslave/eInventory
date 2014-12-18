(function (window, angular) {

    'use strict';

    var moment = require('moment');

    angular.module('app.tools.ClosingService', [])
        .service('ClosingService', function ($q, Config) {
            // Get database connection
            var db = Config.getConnection();
            // Set start date
            this.setStartDate = function (startDate) {
                this.startDate = startDate;
            };
            // Set end date
            this.setEndDate = function (endDate) {
                this.endDate = endDate;
            };
            // Set close date
            this.setCloseDate = function (closeDate) {
                this.closeDate = closeDate;
            };
            // Do close
            this.doClose = function (icode, qty) {
                var q = $q.defer();

                db('stc_cards')
                    .insert({
                        cdate: this.closeDate,
                        icode: icode,
                        ccode: '00000',
                        cname: 'ยอดยกมา',
                        qty_in: qty
                    })
                    .exec(function (err) {
                        if (err) q.reject(err);
                        else q.resolve();
                    });

                return q.promise;
            };

            this.getBalance = function () {
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
                //.toSQL();
                    .exec(function (err, rows) {
                        if (err) q.reject(err);
                        else q.resolve(rows);
                    });
                //console.log(sql);

                return q.promise;
            };

            this.updateLog = function (year) {
                var q = $q.defer();

                db('stc_closing_log')
                    .insert({
                        closed_year: year,
                        closed_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    })
                    .exec(function (err) {
                        if (err) q.reject(err);
                        else q.resolve();
                    });

                return q.promise;
            };

            this.checkClosed = function (year) {
                var q = $q.defer();

                db('stc_closing_log')
                    .count('* as total')
                    .where('closed_year', year)
                    .exec(function (err, rows) {
                        if (err) q.reject(err);
                        else {
                            if (rows[0].total > 0) q.resolve(true);
                            else q.resolve(false);
                        }
                    });

                return q.promise;
            };

        });

})(window, window.angular);
