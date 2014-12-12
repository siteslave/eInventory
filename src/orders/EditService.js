/** Edit order service module **/
(function (window, angular) {

    'use strict';

    angular.module('app.orders.EditService', ['app.common.Config'])
        .factory('EditService', function ($q, Config) {

            var db = Config.getConnection();

            return {
                getOrder: function (orderId) {

                    var q = $q.defer();

                    db('stc_orders')
                        .where('id', orderId)
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows[0]);
                        });

                    return q.promise;
                },

                getOrderDetail: function (orderId) {

                    var q = $q.defer();
                    /*
                    select d.icode, d.qty, d.price, i.name as drug_name, i.units
                    from stc_orders_detail as d
                    left join stc_drug_items as i on i.icode=d.icode
                    where d.order_id=1
                    */
                    db('stc_orders_detail as d')
                        .select('d.icode', 'd.qty', 'd.price', 'i.name', 'i.units as unit')
                        .leftJoin('stc_drug_items as i', 'i.icode', 'd.icode')
                        .where('d.order_id', orderId)
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                },

                saveOrder: function (data) {
                    var q = $q.defer();

                    db('stc_orders')
                        .where('id', data.orderId)
                        .update({
                            order_date: data.orderDate,
                            supplier_code: data.supplierCode,
                            updated_at: data.updatedAt
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                removeOrderDetail: function (orderId) {
                    var q = $q.defer();

                    db('stc_orders_detail')
                        .where('order_id', orderId)
                        .delete()
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                removeOrder: function (orderId) {
                    var q = $q.defer();

                    db('stc_orders')
                    .where('id', orderId)
                    .delete()
                    .exec(function (err) {
                        if (err) q.reject(err);
                        else q.resolve();
                    });

                    return q.promise;
                },

                saveOrderDetail: function (data) {
                    var q = $q.defer();

                    db('stc_orders_detail')
                        .insert(data)
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                }
            };

        });

})(window, window.angular);
