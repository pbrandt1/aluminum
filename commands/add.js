var fs = require('fs')
var path = require('path')
var debug = require('debug')('al:add')
var walk = require('walkdir')
var repoConfig = require('../repo_config')

//
// gets all the files that have been added since last commit
//
function getAddedTree() {
  try {
    var t = JSON.parse(fs.readFileSync(path.resolve(repoConfig.root, 'added_tree.json'), 'utf8'));
  } catch (e) {
    t = {}
  }
  return t;
}

function isInRepo(filepath) {
  return path.resolve(filepath).indexOf(repoConfig.root) ===0;
}


module.exports = function(argv) {
  var addedFiles = getAddedTree();
  add(argv._);
  fs.writeFileSync(path.resolve(repoConfig.root, 'added_tree.json'), JSON.stringify(addedFiles), 'utf8')

  function add(files) {
    files.map(function(file) {
      var filepath = path.resolve(process.cwd(), file)
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
        }
        debug('adding ' + filepath)
        addedFiles[filepath] = true;
      }
    })
  }
}
