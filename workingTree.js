var fs = require('fs')
var path = require('path')
var os = require('os')

var debug = require('debug')('al:workingTree')
var walk = require('walkdir')
var repoConfig = require('./repo_config')
var util = require('./util')


//
// stuff treated like a dependency, eg node_modules
//
var dependencies = [
  path.resolve(repoConfig.root, 'node_modules')
]

function isDependency(filename) {
  for (var i = 0; i < dependencies.length; i++) {
    if (filename.indexOf(dependencies[i]) >= 0) {
      return true;
    }
  }

  // not caught by dependencies
  return false;
}


//
// stuff ignored, eg dist/
//
var ignores = [
  path.resolve(repoConfig.root, '.al'),
  path.resolve(repoConfig.root, '.git'),
];

function isIgnored(filename) {
  for (var i = 0; i < ignores.length; i++) {
    if (filename.indexOf(ignores[i]) >= 0) {
      return true;
    }
  }

  // not caught by ignores
  return false;
}


//
// gets the working dir tree cached at .al/last_commit_tree.json
//
function getLastCommitTree() {
  try {
    var t = JSON.parse(fs.readFileSync(path.resolve(repoConfig.root, 'last_commit_tree.json')));
  } catch (e) {
    t = {}
  }
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
  walk.sync(repoConfig.root, function(filename, stat) {

    // ignores
    if (isDependency(filename)) {
      tree.dependencies[filename] = {
        mtime: stat.mtime
      }
    } else if (isIgnored(filename)) {

    } else {
      tree.source[filename] = {
        mtime: stat.mtime
      }
    }
  })

  return tree;
}


function get() {
  debug('getting directory tree for repo ' + repoConfig.root)
  var t = getCurrentTree();
  var lastCommitTree = getLastCommitTree();
  var addedTree = getAddedTree();
  var conflictTree = getConflictTree();

  // mark status of each source file
  Object.keys(t.source).map(function(filename) {
    var file = t.source[filename]
    if (addedTree[filename]) {
      file.status = util.status.ADDED;
    } else if (conflictTree[filename]) {
      file.status = util.status.CONFLICT;
    } else if (!lastCommitTree[filename]) {
      file.status = util.status.NEW;
    } else if (file.mtime > lastCommitTree[filename].mtime) {
      file.status = util.status.MODIFIED;
    } else {
      file.status = util.status.CLEAN;
    }
  })

  // mark status of each dependency file
  return t;
}

function watch() {
  console.log('not implemented')
}

module.exports = {
  get: get,
  watch: watch
}

if (!module.parent) {
  console.log(get())
}
