var debug = require('debug')(require('../package.json').name);
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var yaml = require('js-yaml');



var Scanner = function(spec) {
  debug('new instance', spec);

  var obj = {};

  var scan = function(dir, done) {
    debug('scanning', dir);

    var apiSpec = {};

    var configFile = path.join(dir, 'config.yaml');
    var config = {};

    if (fs.existsSync(configFile)) {
      config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));

      apiSpec.executable_type = 'juju_charm';
    } else {
      return done();
    }

    if (!_.isEmpty(config.options)) {
      apiSpec.parameters = config.options;

      _.each(apiSpec.parameters, function(param, name) {
        param.mapping = 'charm_option';
      });
    }

    done(null, apiSpec);
  };

  obj.scan = scan;

  return obj;
};



module.exports = Scanner;
