;(function (window, angular) {

    angular.module('app.orders.NewService', ['app.common.Config'])

        .factory('NewService', function ($q, Config) {

            var db = Config.getConnection();

            return {
                getSuppliers: function () {
                    var q = $q.defer();
                    db('stc_suppliers')
                        .select('id', 'name', 'code')
                        .orderBy('name')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                },

                getDrugs: function () {
                    var q = $q.defer();

                    db('stc_drug_items')
                    .select('icode', 'name', 'price', 'cost', 'units')
                    .orderBy('name')
                    .exec(function (err, rows) {

                        if (err) q.reject(err);
                        else q.resolve(rows);

                    });

                    return q.promise;
                },
                // Save order
                saveOrder: function (data) {
                    var q = $q.defer();

                    db('stc_orders')
                        .returning('id')
                        .insert(data)
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows[0]);
                        });

                    return q.promise;
                },

                // Save order detail
                saveOrderDetail: function (items) {
                    var q = $q.defer();

                    db('stc_orders_detail')
                        .insert(items)
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve(items);
                        });

                    return q.promise;
                }
            };
        });

})(window, window.angular);
