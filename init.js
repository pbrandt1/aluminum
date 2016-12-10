var fs = require('mz/fs')
var path = require('path')
var os = require('os')
var al = require('./lib/util')
var co = require('co')

module.exports = function(dir) {
  al.debug('calling init with directory ' + dir);

  return co(function * () {

    // make sure dir exists
    try {
      yield fs.stat(dir)
    } catch (e) {
      al.debug(e)
      throw new Error('Could not access directory ' + dir + '\n' + e)
    }

    // check that there's not already an al repo there
    try {
      var d  = yield fs.stat(path.join(dir, '.al'))
      al.debug(e)
      throw new Error('Repo already exists in directory ' + dir)
    } catch (e) {
      al.debug('no repo exists yet')
    }

    yield make_repo(dir)

  })
}

function * make_repo(dir) {

  // .al directory
  al.debug('making dir ' + path.join(dir, '.al'))
  yield fs.mkdir(path.join(dir, '.al'))

  // user-friendly json config
  var repo_config = JSON.stringify({
    _version: '1.0',
    remotes: [],
  }, null, 2) + '\n'

  yield fs.writeFile(path.join(dir, '.al', 'config.json'), repo_config)

  // initialize the sqlite db
  yield require('./lib/bootstrap_sqlite')(path.join(dir, '.al'))
}
