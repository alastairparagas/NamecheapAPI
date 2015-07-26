(function () {
    'use strict';
    
    var lodash = require('lodash'),
        
        config = {},
        configurableProperties = ['ApiUser', 'ApiKey', 'UserName', 'ClientIp'];
    
    function set(configName, configValue) {
        
        if (configurableProperties.indexOf(configName) === -1) {
            throw new Error("That is not a configurable property.");
        }
        if (!lodash.isString(configValue) || configValue.length === 0) {
            throw new Error("Configurable property must have a string value."); 
        }
        
        if (['ApiUser', 'UserName'].indexOf(configName) > -1) {
            if (configName === "ApiUser" && !config.UserName) {
                config.UserName = configValue;
            }
            if (configName === "UserName" && !config.ApiUser) {
                config.ApiUser = configValue;   
            }
        }
        
        config[configName] = configValue;
    }
    
    function get(globalName) {
        return config[globalName];
    }
    
    function getAll() {
        return lodash.clone(config);   
    }
    
    function getAllConfigurable() {
        return lodash.clone(configurableProperties);
    }
    
    module.exports = {
        set: set,
        get: get,
        getAll: getAll,
        getAllConfigurable: getAllConfigurable
    };
    
}());