;(function (window, angular) {

    angular.module('app.service.Importer', ['app.Config'])
        // Importer factory
        .factory('Importer', function ($q, Config) {

            var dataFactory = {},
                cf = Config.data,
                knex = require('knex')({
                    client: 'mysql',
                    connection: cf.db
                });

            // Get supplier list
            dataFactory.getSuppliers = function () {
                var q = $q.defer();
                knex('stc_suppliers')
                    .select('id', 'name', 'code')
                    .orderBy('name')
                    .exec(function (err, rows) {
                        if (err) q.reject(err);
                        else q.resolve(rows);
                    });

                return q.promise;
            };

            return dataFactory;
        });

})(window, window.angular);