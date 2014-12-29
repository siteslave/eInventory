;(function (window, angular) {

    'use strict';

    angular.module('app.connection.ConnectionController', [])
        .controller('ConnectionController', function ($scope, ConnectionService, Config) {

            var config = Config.getConfigure(),
                _hosxp_username = null,
                _hosxp_password = null;

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

            $scope.$watch(function (scope) {
                _hosxp_username = scope.hosxp_username;
                _hosxp_password = scope.hosxp_password;
            });
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
                        user: _hosxp_username,
                        password: _hosxp_password
                    }
                };

                // Save configure to json file
                ConnectionService.saveConnection(config)
                    .then(function () {
                        swal({
                            title: 'สำเร็จ',
                            text: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                            type: 'success',
                            confirmButtonText: 'ตกลง',
                            timer: 1500
                        });

                        console.log(config);

                    }, function (err) {
                       alert('เกิดข้อผิดพลาด: ' + JSON.stringify(err));
                    });
            };

        });

})(window, window.angular);
