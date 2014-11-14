;(function (window, angular) {
    var App = window.App;
    angular.module('app.controller.Login', ['app.service.Login'])
        .controller('MainController', function ($scope, Login) {
            $scope.isFailed = false;
            $scope.doLogin = function () {
                Login.checkAuth($scope.username, $scope.password)
                    .then(function (success) {
                        if (success) {
                            location.href = '../pages/index.html';
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
        });
})(window, window.angular);