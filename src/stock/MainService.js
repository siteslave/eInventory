(function (window, angular) {

    angular.module('app.stock.MainService', [])
        .factory('MainService', function ($q, Config) {

            var db = Config.getConnection();

            return {
                doInsert: function (code, name) {

                    var q = $q.defer();

                    db('stc_suppliers')
                        .insert({
                            code: code,
                            name: name
                        })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                doUpdate: function (id, name) {
                    var q = $q.defer();

                    db('stc_suppliers')
                        .where('id', id)
                        .update({ name: name })
                        .exec(function (err) {
                            if (err) q.reject(err);
                            else q.resolve();
                        });

                    return q.promise;
                },

                doRemove: function (id) {
                    var q = $q.defer();

                    db('stc_suppliers')
                        .where('id', id)
                        .delete()
                        .exec(function (err) {
                            if (err) q.reject();
                            else q.resolve();
                        });

                    return q.promise;
                },

                getList: function () {
                    var q = $q.defer();
                    db('stc_suppliers')
                        .orderBy('name', 'desc')
                        .exec(function (err, rows) {
                            if (err) q.reject(err);
                            else q.resolve(rows);
                        });

                    return q.promise;
                }
            };

        });

})(window, window.angular);
