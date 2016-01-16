var fs = require('fs')
var path = require('path')

module.exports = function(cwd) {
  var config = {};

  // start and the current directory and go up until we find .al
  while (true) {
    var repo_config_file = path.join(cwd, '.al', 'repo_config.json');
    try {
      fs.statSync(repo_config_file) // throws error if not exists

      config = JSON.parse(fs.readFileSync(repo_config_file, 'utf8'))
      config.root = cwd;
      config.aldir = path.resolve(cwd, '.al');
      return config;
    } catch (e) {
      // if we can't go up one more level, we're done looking for .al/
      if (cwd === path.resolve(cwd, '..')) {
        console.log('Current working directory is not in an aluminum repo')
        process.exit(1)
      }

      // otherwise try going up a level
      cwd = path.resolve(cwd, '..')
    }
  }
}
