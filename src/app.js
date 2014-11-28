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
            database: 'einv',
            user: 'root',
            password: ''
        },
        hosxp: {
            host: '127.0.0.1',
            port: 3306,
            database: 'hosxp_pcu',
            user: 'root',
            password: ''
        },
        dc: {
            url: 'http://his.mkh.go.th:3001',
            private_key: '123456'
        }
    };
    // create configure file
    jf.writeFileSync(App.configFile, config);
}

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