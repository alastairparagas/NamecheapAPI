var lodash = require('lodash'),
    request = require('request'),
    queryString = require('query-string'),
    xml2js = require('xml2js').parseString,
    async = require('async'),
    Promise = require('es6-promise').Promise,

    config = require('./config');

function apiCall(commandName, requestParams, sandbox) {

  if (!commandName || !lodash.isString(commandName)) {
    throw new Error("CommandName is required and must be a string.");
  }
  if (requestParams && !lodash.isPlainObject(requestParams)) {
    throw new Error("requestParams must be an object.");
  }

  var requestUrl = "https://api."+(sandbox?'sandbox.':'')+"namecheap.com/xml.response?",
      providedConfig = config.getAll(),
      requestPayload = {};
  if (!config.isSatisfied()) {
    throw new Error("All Global Parameters must be set.");
  }

  lodash.merge(requestPayload, requestParams, providedConfig);
  requestPayload.Command = commandName;
  requestUrl += queryString.stringify(requestPayload);

  function promiseExecutor(resolve, reject) {
    async.waterfall([
      function (callback) {
        var requestOptions = {
          url: requestUrl
        }
        if(providedConfig['Proxy'] != '') requestOptions.proxy = providedConfig['Proxy'];
        request(requestOptions, function (error, response, body) {
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
      var responseObject = {
        requestPayload: lodash.clone(requestPayload),
        requestUrl: requestUrl
      };

      if (err) {
        responseObject.response = err;
        return reject(responseObject);
      }

      var responseErrors,
          responseCode,
          responseMessage;
      if (result.ApiResponse.$.Status === "ERROR") {
        responseErrors = result.ApiResponse.Errors;
        responseCode = responseErrors[0].Error[0].$.Number;
        responseMessage = responseErrors[0].Error[0]._;
        if (responseCode) {
          responseObject.response = new Error(responseCode +
                                              ": " + responseMessage);
        } else {
          responseObject.response = new Error(responseMessage);
        }
        return reject(responseObject);
      }

      responseObject.response = result.ApiResponse.CommandResponse;
      resolve(responseObject);
    });

  }

  return new Promise(promiseExecutor);

}

module.exports = apiCall;
