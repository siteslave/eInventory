(function (window, angular) {
    angular.module('app.customer.CustomerService', [])
        .factory('CustomerService', function ($q, Config) {

            var db = Config.getConnection();

            return {
                getList: function () {
                    var q = $q.defer();
                    db('stc_customers')
                        .orderBy('name', 'desc')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                }, // get list
                doSave: function (name) {
                    var q = $q.defer();
                    db('stc_customers')
                        .insert({
                            name: name
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },
                // Reomve
                doRemove: function (id) {
                    var q = $q.defer();
                    db('stc_customers')
                        .where('id', id)
                        .delete()
                        .exec(function (err) {
                            if(err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },
                // Update
                doUpdate: function (id, name) {
                    var q = $q.defer();
                    db('stc_customers')
                        .where('id', id)
                        .update({
                            name: name
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                // Check duplicated
                isDuplicated: function (name) {
                    var q = $q.defer();
                    db('stc_customers')
                        .where('name', name)
                        .count('* as total')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else {
                                var result = rows[0].total > 0;
                                q.resolve(result);
                            }
                        });

                    return q.promise;
                }

            };

        });

})(window, window.angular);
