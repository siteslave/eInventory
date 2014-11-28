;(function (window, angular) {

    var moment = require('moment');

    angular.module('app.import.HOSxPService', ['app.common.Config'])
        // Importer factory
        .factory('HOSxPService', function ($q, Config) {

            var db = Config.getConnection(),
                dbHOSxP = Config.getHOSxPConnection();

            return {

                doImportDrug: function (data) {
                    var q = $q.defer();

                    db('stc_drug_items')
                        .insert(data)
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                getHOSxPDrug: function () {
                    var q = $q.defer();

                    dbHOSxP('drugitems as d')
                        .select('d.icode', 'd.name', 'd.unitcost as cost', 'd.unitprice as price',
                            'd.units', 'd.strength', 'd.did', 'd.drugaccount',
                            dbHOSxP.raw('CURRENT_DATE() as updated_at')
                        )
                        .where('d.istatus', 'Y')
                        .whereNotNull('d.name')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                },

                checkDuplicated: function (icode) {
                    var q = $q.defer();

                    db('stc_drug_items')
                        .where('icode', icode)
                        .count('* as total')
                        .exec(function (err, rows) {
                            if (err) {
                                console.log(err);
                                q.resolve(false);
                            } else {
                                var total = rows[0].total || 0;
                                return q.resolve(total);
                            }
                        });

                    return q.promise;
                },

                doUpdateDrug: function (drug) {
                    var q = $q.defer();

                    db('stc_drug_items')
                        .where('icode', drug.icode)
                        .update({
                            name: drug.name,
                            cost: drug.cost,
                            price: drug.price,
                            updated_at: moment().format('YYYY-MM-DD'),
                            units: drug.units,
                            strength: drug.strength,
                            drugaccount: drug.drugaccount
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                /**
                 * Get drug transaction
                 *
                 * @param startDate
                 * @param endDate
                 * @returns {*}
                 */
                getHOSxPDrugPayment: function (startDate, endDate) {
                    var q = $q.defer();
                    /**
                     select icode, hn, vn, an, qty, unitprice as price, vstdate, rxdate
                     from opitemrece
                     where rxdate between "2014-01-01" and "2014-01-30"
                     */
                    dbHOSxP('opitemrece as o')
                        .select('o.icode', 'o.hn', 'o.vn', 'o.an', 'o.qty',
                            'd.unitcost as cost', 'pttype', 'd.unitprice as price', 'o.vstdate', 'o.rxdate')
                        .innerJoin('drugitems as d', 'd.icode', 'o.icode')
                        .whereBetween('o.rxdate', [startDate, endDate])
                        .exec(function (err, rows) {
                            if (err) {
                                q.reject(err);
                            } else {
                                q.resolve(rows);
                            }
                        });

                    return q.promise;
                },

                importDrugPayment: function (drug) {
                    var q = $q.defer();

                    db('stc_payments')
                        .insert(drug)
                        .exec(function (err) {
                            if (err) {
                                q.reject(err);
                            } else {
                                q.resolve();
                            }
                        });

                    return q.promise;
                },

                removeDrugPayment: function (startDate, endDate) {
                    var q = $q.defer();

                    db('stc_payments')
                        .whereBetween('rxdate', [startDate, endDate])
                        .delete()
                        .exec(function (err) {
                            if (err) {
                                q.reject(err);
                            } else {
                                q.resolve();
                            }
                        });

                    return q.promise;
                },

                // remove old pttype
                removeRight: function () {
                    var q = $q.defer();

                    db('stc_pttype')
                        .delete()
                        .exec(function (err) {
                            if (err) {
                                q.reject(err);
                            } else {
                                q.resolve();
                            }
                        });

                    return q.promise;
                },
                removePCode: function () {
                    var q = $q.defer();

                    db('stc_pcode')
                        .delete()
                        .exec(function (err) {
                            if (err) {
                                q.reject(err);
                            } else {
                                q.resolve();
                            }
                        });

                    return q.promise;
                },

                importRight: function (data) {
                    var q = $q.defer();

                    db('stc_pttype')
                        .insert(data)
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                importPCode: function (data) {
                    var q = $q.defer();

                    db('stc_pcode')
                        .insert(data)
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                getHOSxPRight: function () {
                    var q = $q.defer();

                    dbHOSxP('pttype')
                        .select('pttype as code', 'name', 'pcode')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                },

                getHOSxPPCode: function () {
                    var q = $q.defer();

                    dbHOSxP('pcode')
                        .select('code', 'name')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                }

            };
        });

})(window, window.angular);