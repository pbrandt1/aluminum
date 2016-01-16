var debug = require('debug')('al')
module.exports = function(argv) {
  var original_command = argv.command;
  var command;

  if (original_command === 'int') {
    command = 'init';
  } else if (typeof original_command === 'undefined') {
    command = 'help';
  } else {
    command = original_command;
  }

  if (command !== original_command) {
    debug('corrected command to "' + command + '"')
  }
  return command;
}
