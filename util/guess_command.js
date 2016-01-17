var debug = require('debug')('al')
module.exports = function(argv) {
  var commands = [
    'add',
    'checkout',
    'clone',
    'commit',
    'help',
    'ignore',
    'init',
    'merge',
    'push',
    'revert',
    'status',
    'unadd',
    'update'
  ];

  // check base case
  if (commands.indexOf(argv.command) >= 0) {
    return argv.command;
  }

  // make sure it's at least two letters
  if (argv.command.length < 2) {
    console.log('Cannot identify command al ' + argv.command);
    return 'help'
  }

  // check for two-letter things
  for (var i = 0; i < commands.length; i++) {
    if (commands[i].substring(0, 2) === argv.command.substring(0, 2)) {
      return commands[i];
    }
  }

  // use levenshteinDistance
  return commands.map(function(c) {
    return {
      command: c,
      dist: levenshteinDistance(c, argv.command)
    }
  }).sort(function(a, b) {
    return a.dist > b.dist ? 1 : -1;
  })[0].command;
}


function levenshteinDistance (a, b){
  if(a.length == 0) return b.length;
  if(b.length == 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }
  console.log(a, b, matrix[b.length][a.length])
  return matrix[b.length][a.length];
};

if (!module.parent) {
  var argv = {
    command: process.argv[2]
  }
  console.log(module.exports(argv))
}
