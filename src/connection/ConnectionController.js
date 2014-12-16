;(function (window, angular) {

    'use strict';

    angular.module('app.connection.ConnectionController', [])
        .controller('ConnectionController', function ($scope, ConnectionService, Config) {

            var config = Config.getConfigure();

            $scope.host = config.db.host;
            $scope.port = config.db.port;
            $scope.dbname = config.db.database;
            $scope.username = config.db.user;
            $scope.password = config.db.password;
            $scope.url = config.dc.url;
            $scope.private_key = config.dc.private_key;
            $scope.hosxp_host = config.hosxp.host;
            $scope.hosxp_username = config.hosxp.user;
            $scope.hosxp_password = config.hosxp.password;
            $scope.hosxp_port = config.hosxp.port;
            $scope.hosxp_dbname = config.hosxp.database;

            // When save button click this event will be fire
            $scope.saveConnection = function () {

                var config = {
                    db: {
                        host: $scope.host,
                        port: $scope.port,
                        database: $scope.dbname,
                        user: $scope.username,
                        password: $scope.password
                    },
                    dc: {
                        url: $scope.url,
                        private_key: $scope.private_key
                    },
                    hosxp: {
                        host: $scope.hosxp_host,
                        port: $scope.hosxp_port,
                        database: $scope.hosxp_dbname,
                        user: $scope.hosxp_username,
                        password: $scope.hosxp_password
                    }
                };

                console.log(config);

                // Save configure to json file
                ConnectionService.saveConnection(config)
                    .then(function () {
                        alert('บันทึกข้อมูลเสร็จเรียบร้อยแล้ว');
                    }, function (err) {
                       alert('เกิดข้อผิดพลาด: ' + JSON.stringify(err));
                    });
            };

        });

})(window, window.angular);
