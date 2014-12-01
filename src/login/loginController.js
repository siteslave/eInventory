;(function (window, angular) {
    var App = window.App,
        moment = require('moment');

    angular.module('app.login.LoginController', ['app.login.LoginService'])
        .controller('LoginController', function ($scope, $window, Login) {
            $scope.isFailed = false;
            $scope.period = null;

            $scope.doLogin = function () {
                Login.checkAuth($scope.username, $scope.password)
                    .then(function (success) {
                        if (success) {
                            Login.getPeriodRange($scope.period)
                                .then(function (rows) {
                                    $window.sessionStorage.setItem('year', $scope.period);
                                    $window.sessionStorage.setItem('startDate', moment(rows.start_date).format('YYYY-MM-DD'));
                                    $window.sessionStorage.setItem('endDate', moment(rows.end_date).format('YYYY-MM-DD'));
                                    location.href = '../pages/index.html';
                                }, function (err) {
                                    console.log(err);
                                });

                        } else {
                            $scope.isFailed = true;
                        }
                    }, function (err) {
                        console.log(err);
                        alert('Error: ' + JSON.stringify(err));
                    });
            };
            // Exit program
            $scope.doExit = function () {
                if (confirm('คุณต้องการปิดโปรแกรมใช่หรือไม่?')) App.doExit();
            };

            Login.getPeriod()
                .then(function (rows) {
                    $scope.periods = rows;
                }, function (err) {
                    console.log(err);
                });


        });
})(window, window.angular);