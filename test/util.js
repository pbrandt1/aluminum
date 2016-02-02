var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var walker = require('walker')

var test_dir = module.exports.dir = path.join(__dirname, 'test_repo')

// Synchronously makes the test repo stuff
module.exports.init = function() {
  rimraf.sync(test_dir)
  mkdirp.sync(test_dir)
  fs.writeFileSync(path.join(test_dir, 'a.txt'), 'wow\nsuch\n')
  fs.writeFileSync(path.join(test_dir, 'm1.txt'), 'wow\nsuch\n')
  fs.writeFileSync(path.join(test_dir, 'm2.txt'), 'wow\nsuch\n')
  mkdirp.sync(path.join(test_dir, 'subdir'))
  mkdirp.sync(path.join(test_dir, 'ignored_subdir'))
  fs.writeFileSync(path.join(test_dir, '.alignore'), 'ignored_subdir/\n')
  fs.writeFileSync(path.join(test_dir, 'subdir', 'b.txt'), 'very\ntest\n')
  fs.writeFileSync(path.join(test_dir, 'ignored_subdir', 'b.txt'), 'very\ntest\n')
}

// walks a directory and returns a hash of filename:stat pairs.
module.exports.walk = function(dir, cb) {
  var files = {};
  walker(dir)
    .on('entry', function (entry, stat) {
      files[entry] = stat;
    })
    .on('end', function() {
      cb(files);
    })
}
