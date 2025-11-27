const defer = require('config/defer').deferConfig;

const _ = require('lodash');

module.exports = function getServiceConfig(dependency, options) {
  return defer(function (config) {
    return _.defaultsDeep(options, config.dependencies[dependency], {
      dependency,
    });
  });
};
