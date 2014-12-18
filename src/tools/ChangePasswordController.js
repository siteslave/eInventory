(function (window, angular) {
    'use strict';

    var crypto = require('crypto'),
        App = window.App;

    angular.module('app.tools.ChangePasswordController', [])
        .controller('ChangePasswordController', function ($scope, ChangePasswordService) {

            $scope.doChange = function () {

                if ($scope.newPassword1 == $scope.newPassword2) {

                    var hash = crypto.createHmac('sha256', App.saltKey)
                        .update($scope.newPassword1)
                        .digest('base64');

                    ChangePasswordService.doChangePassword(hash)
                        .then(function () {
                            // success
                            swal({
                                title: 'สำเร็จ',
                                text: 'เปลี่ยนรหัสผ่านเสร็จเรียบร้อยแล้ว',
                                type: 'warning',
                                confirmButtonText: 'ตกลง',
                                timer: 1500
                            });

                            $scope.newPassword1 = '';
                            $scope.newPassword2 = '';
                        }, function (err) {
                            console.log(err);
                        });
                } else {
                    swal({
                        title: 'เกิดข้อผิดพลาด',
                        text: 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบ',
                        type: 'warning',
                        confirmButtonText: 'ตกลง'
                    });
                }
            };
        });

})(window, window.angular);
