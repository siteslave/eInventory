;(function (window, angular) {

    angular.module('app.import.HOSxPService', ['app.common.Config'])
        // Importer factory
        .factory('HOSxPService', function ($q, Config) {

            var db = Config.getConnection();

            return {

            };
        });

})(window, window.angular);