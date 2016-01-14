#!/usr/bin/env node

var debug = require('debug')('al');
var argv = require('minimist')(process.argv.slice(2));
argv.command = argv._.splice(0, 1)[0]
argv.command = require('./guess_command')(argv);
debug(argv)

require('./commands/' + argv.command)(argv);
