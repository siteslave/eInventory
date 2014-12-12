(function (window, angular) {
    'use strict';

    angular.module('app.clearance.PaymentService', ['app.common.Config'])
        .factory('PaymentService', function ($q, Config) {

            var db = Config.getConnection();

            return {
                getPaymentLog: function () {
                    var q = $q.defer();

                    db('stc_payments_log')
                        .select('*')
                        .where('is_imported', 'N')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                },

                removePaymentLog: function (id) {
                    var q = $q.defer();

                    db('stc_payments_log')
                        .where('id', id)
                        .delete()
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                removePayment: function (startDate ,endDate) {
                    var q = $q.defer();

                    db('stc_payments')
                        .whereBetween('rxdate', [startDate, endDate])
                        .delete()
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                // Get all payment
                getPayments: function (startDate, endDate) {

                    var q = $q.defer();

                    db('stc_payments')
                        .select('guid', 'icode', db.raw('0 as qty_in'), 'qty as qty_out', 'vn as ccode', 'hn as cname', 'rxdate as cdate')
                        .whereBetween('rxdate', [startDate, endDate])
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                },

                // Insert payment to stockcard
                saveToStockCard: function (v) {
                    var q = $q.defer();

                    db.raw('insert into stc_cards set icode=?, qty_in=?, qty_out=?, ccode=?, cname=?, cdate=? ON DUPLICATE KEY UPDATE qty_out=?', [v.icode, v.qty_in, v.qty_out, v.ccode, v.cname, v.cdate, v.qty_out])
                        .exec(function (err) {
                            if (err) {
                                q.reject(err);
                            } else {
                                q.resolve();
                            }
                        });

                    return q.promise;
                },

                updateClearanceStatus: function (guid) {
                    var q = $q.defer();

                    db('stc_payments')
                        .where('guid', guid)
                        .update({
                            is_clearanced: 'Y'
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                updateImportedStatus: function (id) {
                    var q = $q.defer();

                    db('stc_payments_log')
                        .where('id', id)
                        .update({
                            is_imported: 'Y'
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                updateStockQty: function (icode, qty) {
                    var q = $q.defer();

                    db('stc_drug_items')
                    .where('icode', icode)
                    .decrement('qty', qty)
                    .exec(function (err) {
                        if (err) q.reject(err);
                        else q.resolve();
                    });

                    return q.promise;
                }
            };

        });

})(window, window.angular);