(function (window, angular) {
    'use strict';

    angular.module('app.clearance.OrderService', ['app.common.Config'])
        .factory('OrderService', function ($q, Config) {

            var db = Config.getConnection();

            return {
                getOrders: function () {
                    var q = $q.defer();
                    /*
                    select o.order_code, o.order_date, o.supplier_code, s.name as supplier_name,
                    sum(d.qty) as total_qty, sum(d.qty*d.price) as total_price, o.is_imported
                    from stc_orders as o
                    inner join stc_orders_detail as d on d.order_id=o.id
                    left join stc_suppliers as s on s.code=o.supplier_code
                    group by o.order_code
                    order by o.order_date
                    */

                    db('stc_orders as o')
                    .select('o.id', 'o.order_code', 'o.order_date', 'o.supplier_code', 's.name as supplier_name',
                    db.raw('sum(d.qty) as total_qty'), db.raw('sum(d.qty*d.price) as total_price'), 'o.is_imported')
                    .innerJoin('stc_orders_detail as d', 'd.order_id', 'o.id')
                    .leftJoin('stc_suppliers as s', 's.code', 'o.supplier_code')
                    .where('o.is_imported', 'N')
                    .groupBy('o.order_code')
                    .orderBy('o.order_date')
                    .exec(function (err, rows) {
                        if (err) q.reject(err);
                        else q.resolve(rows);
                    });

                    return q.promise;
                },

                // Get drug items
                getDrugItems: function (orderId) {
                    var q = $q.defer();

                    db('stc_orders_detail')
                        .where('order_id', orderId)
                        .where('is_imported', 'N')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                },

                saveStockCard: function (icode, qty, orderCode, orderDate, supplierName) {
                    var q = $q.defer();

                    db('stc_cards')
                        .insert({
                            cdate: orderDate,
                            icode: icode,
                            ccode: orderCode,
                            cname: supplierName,
                            qty_in: qty
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                updateQty: function (icode, qty) {

                    var q = $q.defer();

                    db('stc_drug_items')
                        .where('icode', icode)
                        .increment('qty', qty)
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                updateOrderDetail: function (icode, orderId, importedDate) {

                    var q = $q.defer();

                    db('stc_orders_detail')
                        .where('icode', icode)
                        .where('order_id', orderId)
                        .update({
                            is_imported: 'Y',
                            imported_date: importedDate
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                updateOrderStatus: function (orderId, importedDate) {

                    var q = $q.defer();

                    db('stc_orders')
                        .where('id', orderId)
                        .update({
                            is_imported: 'Y',
                            imported_date: importedDate
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
