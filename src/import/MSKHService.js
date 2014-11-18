;(function (window, angular) {

    angular.module('app.import.MSKHService', ['app.common.Config'])
        // Importer factory
        .factory('MSKHService', function ($q, Config) {

            var db = Config.getConnection();

            return {

            };
        });

})(window, window.angular);