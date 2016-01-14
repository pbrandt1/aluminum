var fs = require('fs')
var path = require('path')

var found = false;
var currentPath = process.cwd();
while (!found) {
  var repo_config_file = path.join(currentPath, '.al', 'repo_config.json');
  try {
    fs.statSync(repo_config_file)
    found = true;
    module.exports = JSON.parse(fs.readFileSync(repo_config_file, 'utf8'))
    module.exports.root = currentPath;
  } catch (e) {
    // not found
    // if we can't go up one more level, we're done looking for .al/
    if (currentPath === path.resolve(currentPath, '..')) {
      console.log('Current working directory is not in an aluminum repo')
      process.exit(1)
    }
    currentPath = path.resolve(currentPath, '..')
  }
}
