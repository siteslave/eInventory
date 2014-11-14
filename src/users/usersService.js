;(function (window, angular) {
    'use strict';

    angular.module('app.services.Users', [])
        .factory('Users', function ($q) {
           var Users = {};

            Users.list = function () {};
            Users.detail = function () {};
            Users.save = function () {};
            Users.remove = function () {};
            Users.update = function () {};
            Users.search = function () {};

            return Users;
        });
})(window, window.angular);