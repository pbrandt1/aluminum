#!/usr/bin/env node

var debug = require('debug')('al');
var argv = require('minimist')(process.argv.slice(2));
debug(argv)

// cli or module usage, why not both?
if ( argv._.length > 0 ) {
  argv.command = argv._[0]
  debug(argv)
  argv.command = require('./cli/run_command')(argv);
  argv.cwd = process.cwd();
} else {
  module.exports = {
    init: require('./init'),
    add: require('./add')
  }
}
