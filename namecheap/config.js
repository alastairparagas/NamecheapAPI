var lodash = require('lodash'),

    config = { 'Proxy': '' },
    requiredProperties = 
      ['ApiUser', 'ApiKey', 'UserName', 'ClientIp', 'Proxy'];

function set(configName, configValue) {

  if (requiredProperties.indexOf(configName) === -1) {
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

function isSatisfied() {
  return lodash.every(requiredProperties, function (requiredProperty) {
    return config.hasOwnProperty(requiredProperty);
  });
}

module.exports = {
  set: set,
  get: get,
  getAll: getAll,
  isSatisfied: isSatisfied
};
