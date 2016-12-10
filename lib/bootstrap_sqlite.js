var sqlite = require('sqlite')
var al = require('./util')
var co = require('co')
var path = require('path')

module.exports = function(dir) {
  return co(function * () {
    var dbpath = path.join(dir, 'db.sqlite')
    al.debug('initilizing sqlite3 database at ' + dbpath)
    var db = sqlite.open(dbpath)
  })
}
