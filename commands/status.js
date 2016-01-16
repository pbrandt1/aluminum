var fs = require('fs')
var path = require('path')
var util = require('../util/util')
require('colors')

module.exports = function(argv) {
  require('../util/files')(process.cwd(), function(err, files) {
    if (err) { console.log(err) }
    Object.keys(files.source).map(function(filename) {
      var f = files.source[filename]
      f.filename = filename;
      var relpath = path.relative('.', f.filename) || '.';
      f.str = f.status + ' ' + relpath;
      return f;
    }).sort(function(a, b) {
      return a.str > b.str ? 1 : -1;
    }).map(function(f) {
      switch (f.status) {
        case util.status.NEW:
        case util.status.MODIFIED:
          console.log(f.str.red)
          break;
        case util.status.ADDED:
          console.log(f.str.green);
          break;
      }
    })
  })

}
