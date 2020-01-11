'use strict';
const mergeJSON = require('merge-json');
const path = require("path");
const fs = require('fs');

module.exports = class xrequire {
    constructor(node_modulesLocation, config = {}) {
        this._node_modulesLocation = node_modulesLocation;
        if (!global.hasOwnProperty("extendedrequirer")) {
            var defaultConfig = {
                "currentConfig" : "PRO",
                "DEV": "..",
                "PRO" : "node_modules"
            };
            var _conf = "PRO";
            global.extendedrequirer  = mergeJSON.merge(defaultConfig, config)
        }
    }

    require(module) {
        var baseFolder = global.hasOwnProperty("__basedir") ? global.__basedir : __dirname;
        var fileToRequire = path.join( baseFolder, global.extendedrequirer[global.extendedrequirer.currentConfig] , module ,"/index.js");
        if (!fs.existsSync(fileToRequire)){
            var packageJSONFile = path.join( this._node_modulesLocation, "node_modules", module,"package.json");
            if (!fs.existsSync(packageJSONFile))
                return require(module);
            var packageJSON = JSON.parse(fs.readFileSync(packageJSONFile));
            var mainJS = packageJSON.main;//packageJSON.hasOwnProperty("main") ? packageJSON.main : "index.js";
            if (!fs.existsSync(mainJS))
                mainJS = "index.js";
            fileToRequire = path.join( this._node_modulesLocation, "node_modules", module, mainJS);
            if (!fs.existsSync(fileToRequire))
                return require(module);
        }
        return require(fileToRequire);
    }
}