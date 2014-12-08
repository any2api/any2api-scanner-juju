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

    var configFile = path.join(dir, 'config.yaml');
    var config = {};

    var metadataFile = path.join(dir, 'metadata.yaml');
    var metadata = {};

    var executable = {};

    if (fs.existsSync(configFile)) {
      config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
      metadata = yaml.safeLoad(fs.readFileSync(metadataFile, 'utf8'));

      executable.name = metadata.name + '-charm';
      executable.type = 'juju_charm';
      executable.charm_name = metadata.name;
    } else {
      return done();
    }

    if (fs.existsSync(path.join(dir, 'README.md'))) {
      executable.readme = 'README.md';
    }

    if (!_.isEmpty(config.options)) {
      executable.parameters_schema = config.options;

      _.each(executable.parameters_schema, function(param, name) {
        param.mapping = 'charm_option';
      });
    }

    done(null, executable);
  };

  obj.scan = scan;

  return obj;
};



module.exports = Scanner;
