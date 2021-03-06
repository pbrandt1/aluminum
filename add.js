var fs = require('fs')
var path = require('path')
var os = require('os')
var al = require('./lib/util')
var debug = al.debug
var file_tree = require('./lib/file_tree')

//
// gets all the files that have been added since last commit
//
function getAddedTree() {
  try {
    var t = fs.readFileSync(path.resolve(repoConfig.aldir, 'added'), 'utf8').split(os.EOL);
  } catch (e) {
    t = []
  }
  return t;
}

function isInRepo(filepath) {
  return path.resolve(filepath).indexOf(repoConfig.root) === 0;
}


module.exports = function(argv) {
  repoConfig = require('../util/repo_config')(argv.cwd);

  var addedFiles = getAddedTree();
  add(argv._);
  fs.writeFileSync(path.resolve(repoConfig.aldir, 'added'), addedFiles.join(os.EOL), 'utf8')

  function add(files) {
    files.map(function(file) {
      var filepath = path.resolve(process.cwd(), file)
      var relpath = path.relative(repoConfig.root, filepath) // saved as relpaths
      if (addedFiles.indexOf(relpath) >= 0) {
        return;
      }
      var stats;
      try {
        stats = fs.statSync(filepath);
      } catch (e) {
        console.error('can not add file ' + file)
        process.exit(1)
      }
      if (isInRepo(filepath)) {
        if (stats.isDirectory()) {
          add(fs.readdirSync(filepath).map(function(f) {
            return path.join(file, f)
          }));
          return
        } else {
          var relpath = path.relative(repoConfig.root, filepath);
          debug('adding ' + relpath);
          addedFiles.push(relpath);
        }
      }
    })
  }
}
