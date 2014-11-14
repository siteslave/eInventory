var path = require('path'),
    fs = require('fs'),
    jf = require('jsonfile'),
    gui = require('nw.gui'),
    win = gui.Window.get();

// Namespace
var App = window.App || {};
// App version
App.version = '1.0.0';
App.saltKey = "TheCatEatTheRat";
// Application data path
App.appPath = gui.App.dataPath;
// Set space for json file
jf.spaces = 2;
App.configFile = path.join(App.appPath, 'config.json');

// Check configuration file exist
var isExist = fs.existsSync(App.configFile);
if (!isExist) {
    var config = {
        db: {
            host: '127.0.0.1',
            port: 3306,
            database: 'App',
            user: 'root',
            password: ''
        },
        dc: {
            url: 'http://his.mkh.go.th:3000',
            private_key: '123456'
        }
    };
    // create configure file
    jf.writeFileSync(App.configFile, config);
}

// clear null value
App.clearNull = function (str) {
  return !str ? '-' : str;
};

// Get url parameters
App.getUrlParam = function (param) {
    var pageUrl = window.location.search.substring(1),
        urlVal = pageUrl.split('&');

    for (var i = 0; i < urlVal.length; i++) {
        var sParamName = urlVal[i].split('=');
        if (sParamName[0] == param) return sParamName[1];
    }
};

// Exit program
App.doExit = function () {
    gui.App.quit();
};

// show window when ready
onload = function() {
    win.show();
};

process.on('uncaughtException', function (e) {
    console.log(e);
});

;(function (window, angular) {
    angular.module('app', [
        'app.connections',
        'app.users',
        'app.filters.Main',
        'app.services.Users'
    ]);
})(window, window.angular);