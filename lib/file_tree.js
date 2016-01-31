var fs = require('fs')
var path = require('path')
var os = require('os')

var debug = require('debug')('al:file_tree')
var util = require('./util')


/**
 * Get all the files in the repo
 */
module.exports = function (cwd, cb) {
  var repoConfig = require('./repo_config')(cwd)
  debug(repoConfig);
  debug('getting directory tree for repo ' + repoConfig.root)

  var files = {
    ignored: {},
    source: {},
    added: {},
    conflicts: {},

    isIgnored: function (filename) {
      return !!this.ignored[filename];
    }

  };

  files.ignored[path.resolve(repoConfig.root, '.al')] = true;
  files.ignored[path.resolve(repoConfig.root, 'node_modules')] = true;

  try {
    files.added = fs.readFileSync(path.resolve(repoConfig.aldir, 'added'), 'utf8')
      .split(os.EOL)
      .reduce(function(added, f) {
        added[path.resolve(repoConfig.root, f)] = true;
        return added;
      }, {})
  } catch (e) {
    files.added = []
  }

  try {
    files.conflicts = fs.readFileSync(path.resolve(repoConfig.aldir, 'conflicts'), 'utf8')
      .split(os.EOL)
      .reduce(function(conflicts, f) {
        conflicts[path.resolve(repoConfig.root, f)] = true;
        return conflicts;
      }, {})
  } catch (e) {
    files.conflicts = {}
  }

  // last commit files
  var last_commit_files;
  try {
    last_commit_files = JSON.parse(fs.readFileSync(path.resolve(repoConfig.root, 'last_commit_files.json')));
  } catch (e) {
    last_commit_files = {
      ignored: {},
      source: {},
      added: {},
      conflicts: {}
    };
  }

  debug(files);


  // Get the files yay
  walk(repoConfig.root, function(err) {
    if (err) { return cb(err) }
    debug('done getting directory tree for repo ' + repoConfig.root)
    cb(null, files);
  });

  // recursive directory walk that skips files.ignored
  function walk(dir, cb) {
    debug('walking ' + dir)
    fs.readdir(dir, function(err, dirfiles) {
      var filesLeft = dirfiles.length;
      var done = false;
      dirfiles.map(function(f) {
        if (f === '.alignore'){
          filesLeft--;
          return parseIgnoreFile(path.resolve(dir, f));
        }

        // use full path
        f = path.resolve(dir, f);

        // handle ignored files
        if (files.isIgnored(f)) {
          filesLeft--;
          return;
        }

        fs.stat(f, function(err, stats) {
          // recurse if directory
          if (stats.isDirectory()) {
            walk(f, function(err) {
              filesLeft--;
              if (filesLeft === 0) {
                debug('done2 ' + dir)
                cb();
              }
            })
          }

          // add if file
          if (stats.isFile()) {
            filesLeft--;
            var file = {
              mtime: stats.mtime
            };

            if (files.added[f]) {
              file.status = util.status.ADDED;
            } else if (files.conflicts[f]) {
              file.status = util.status.CONFLICT;
            } else if (!last_commit_files.source[f]) {
              file.status = util.status.NEW;
            } else if (file.mtime > last_commit_files[f].mtime) {
              file.status = util.status.MODIFIED;
            } else {
              file.status = util.status.CLEAN;
            }

            files.source[f] = file;
          }

          if (filesLeft === 0) {
            debug('done ' + dir);
            cb();
          }
        })
      })
    })
  }

  // parses .alignore files
  function parseIgnoreFile(f) {
    var dir = path.dirname(f);
    fs.readFileSync(f, 'utf8')
      .split(os.EOL)
      .filter(function(line) {
        return line && (typeof line === 'string') && line.trim()[0] !== '#';
      }).map(function(filename) {
        filename = filename.trim();
        if (filename[0] === '!') {
          files.ignored[path.resolve(dir, filename.slice(1))] = false;
        } else {
          files.ignored[path.resolve(dir, filename)] = true;
        }
      })
  }
}



//
// gets the working dir tree cached at .al/last_commit_tree.json
//
function getLastCommitTree() {

  return t;
}


//
// gets all the files that have been added since last commit
//
function getAddedTree() {
  try {
    var t = JSON.parse(fs.readFileSync(path.resolve(repoConfig.root, 'added_tree.json')));
  } catch (e) {
    t = {}
  }
  return t;
}


//
// gets all the files that have been added since last commit
//
function getConflictTree() {
  try {
    var t = JSON.parse(fs.readFileSync(path.resolve(repoConfig.root, 'conflict_tree.json')));
  } catch (e) {
    t = {}
  }
  return t;
}


//
// gets the current dir tree, to be diffed with the last commit
//
function getCurrentTree() {
  var tree = {
    source: {},
    dependencies: {}
  };
  return tree;
}


function get() {

  var t = getCurrentTree();
  var lastCommitTree = getLastCommitTree();
  var addedTree = getAddedTree();
  var conflictTree = getConflictTree();

  // mark status of each source file
  Object.keys(t.source).map(function(filename) {
    var file = t.source[filename]

  })

  // mark status of each dependency file
  return t;
}
