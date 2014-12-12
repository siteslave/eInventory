(function (window, angular) {

    'use strict';

    angular.module('app.orders.MainService', ['app.common.Config'])
        .factory('MainService', function ($q, Config) {

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
                }
            };

        });

})(window, window.angular);
