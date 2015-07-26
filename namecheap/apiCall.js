(function () {
    'use strict';

    var lodash = require('lodash'),
        request = require('request'),
        xml2js = require('xml2js').parseString,
        async = require('async'),
        Promise = require('es6-promise').Promise,

        config = require('./config');

    function apiCall(commandName, requestParams) {

        if (!commandName || !lodash.isString(commandName)) {
            throw new Error("CommandName is required and must be a string.");
        }
        if (requestParams && !lodash.isPlainObject(requestParams)) {
            throw new Error("requestParams must be an object.");    
        }

        var requestUrl = "https://api.namecheap.com/xml.response?",
            providedConfig = config.getAll(),
            configProp,
            requestProp;
        if (!config.isSatisfied()) {
            throw new Error("All Global Parameters must be set.");
        }
        for (configProp in providedConfig) {
            requestUrl += configProp + "=" + providedConfig[configProp];
        }
        for (requestProp in requestParams) {
            requestUrl += requestProp + "=" + requestParams[requestProp];
        }

        function promiseExecutor(resolve, reject) {
            async.waterfall([
                function (callback) {
                    request(requestUrl, function (error, response, body) {
                        if (error && !body) {
                            return callback(error);
                        }
                        callback(null, body);
                    });
                },
                function (xmlString, callback) {
                    xml2js(xmlString, function (error, data) {
                        if (error && !data) {
                            return callback(error);   
                        }
                        callback(null, data);
                    });
                }
            ], function (err, result) {
                if (err) {
                    return reject(err.message);   
                }
                
                var responseErrors = result.ApiResponse.Errors,
                    responseCode = responseErrors[0].Error[0].$.Number,
                    responseMessage = responseErrors[0].Error[0]._;
                if (result.ApiResponse.$.Status === "ERROR") {
                    if (responseCode) {
                        return reject(responseCode + ": " + responseMessage);  
                    }
                    return reject(responseMessage);
                }
                
                resolve(result.ApiResponse.CommandResponse);
            });

        }

        return new Promise(promiseExecutor);

    }

    module.exports = apiCall;

}());