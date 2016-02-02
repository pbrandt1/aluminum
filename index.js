#!/usr/bin/env node

var debug = require('debug')('al');
var argv = require('minimist')(process.argv.slice(2));

// cli or module usage?
if (argv.lenght > 0) {
  debug('cli usage')
  argv.command = argv._.splice(0, 1)[0]
  argv.command = require('./util/guess_command')(argv);
  argv.cwd = process.cwd();
  debug(argv)
} else {
  debug('module usage')
  module.exports = {
    init: require('./lib/init'),
    add: require('./lib/add')
  }
}
