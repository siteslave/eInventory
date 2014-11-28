
;(function (window, angular) {

    'use strict';

    // Global namespace
    var App = window.App;

    // Modules requirement
    var jf = require('jsonfile'),
        config = jf.readFileSync(App.configFile);

    angular.module('app.common.Config', [])
        .factory('Config', function ($q) {

           return {
               getConfigure: function () {
                   // Get configuration
                   return config;
               },
               getConnection: function () {
                   return require('knex')({
                       client: 'mysql',
                       connection: config.db
                   });
               },
               getHOSxPConnection: function () {
                   return require('knex')({
                       client: 'mysql',
                       connection: config.hosxp
                   });
               }
           };

        });

})(window, angular);