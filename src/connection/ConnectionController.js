(function (window, angular) {

    'use strict';

    angular.module('app.connection.ConnectionController', [])
        .controller('ConnectionController', function ($scope, ConnectionService, Config) {

            var configDB = Config.getConfigure();

            $scope.host = configDB.db.host;
            $scope.port = configDB.db.port;
            $scope.dbname = configDB.db.database;
            $scope.username = configDB.db.user;
            $scope.password = configDB.db.password;
            $scope.url = configDB.dc.url;
            $scope.private_key = configDB.dc.private_key;
            $scope.hosxp_host = configDB.hosxp.host;
            $scope.hosxp_username = configDB.hosxp.user;
            $scope.hosxp_password = configDB.hosxp.password;
            $scope.hosxp_port = configDB.hosxp.port;
            $scope.hosxp_dbname = configDB.hosxp.database;

            // When save button click this event will be fire
            $scope.saveConnection = function () {

                var configData = {
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

                // Save configure to json file
                ConnectionService.saveConnection(configData)
                    .then(function () {
                        swal({
                            title: 'สำเร็จ',
                            text: 'บันทึกข้อมูลเสร็จเรียบร้อยแล้ว',
                            type: 'success',
                            confirmButtonText: 'ตกลง',
                            timer: 1500
                        });

                        console.log(configData);

                    }, function (err) {
                       alert('เกิดข้อผิดพลาด: ' + JSON.stringify(err));
                    });
            };

        });

})(window, window.angular);
