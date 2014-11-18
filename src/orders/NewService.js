;(function (window, angular) {

    angular.module('app.orders.NewService', ['app.common.Config'])

        .factory('Importer', function ($q, Config) {

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
                }
            };
        });

})(window, window.angular);