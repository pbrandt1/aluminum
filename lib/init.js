var fs = require('fs')
var path = require('path')
var os = require('os')
var debug = require('debug')('al:init')

module.exports = function(dir, cb) {
  debug('calling init with directory ' + dir);

  // check that the specified dir exists
  fs.stat(dir, function(e, s) {
    if (e) {
      debug(e)
      return cb(new Error('Could not access directory ' + dir + '\n' + e));
    }

    // check that there's not already an al repo there
    fs.stat(path.join(dir, '.al'), function(e, s) {
      if (!e) {
        return cb(new Error('Repo already exists in directory ' + dir))
      }

      make_repo(dir, cb);
    })
  })
}

function make_repo(dir, cb) {
  debug('creating repo in dir ' + dir)
  fs.mkdir(path.join(dir, '.al'), function (e, s) {
    if (e) {
      return cb(new Error('Could not create meta file directory in ' + dir))
    }

    var repo_config = JSON.stringify({
      root: dir
    }, null, 2) + '\n';

    fs.writeFile(path.join(dir, '.al', 'repo_config.json'), repo_config, cb);
  })
}
