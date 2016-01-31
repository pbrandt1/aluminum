var should = require('should')
var al = require('../index')
var fs = require('fs')
var path = require('path')

var test_util = require('./util');
test_util.init();

describe('module usage', function() {
  describe('init', function () {
    it('should create the appropriate file structure upon initialization', function (done) {
      al.init(test_util.dir, function (err) {
        should.not.exist(err);
        // make sure the al directory exists
        var al = path.join(test_util.dir, '.al')
        fs.statSync(al);
        // make sure everything in the .al directory exists
        test_util.walk(al, function (dot_files) {
          dot_files.should.have.properties(
            path.join(al, 'repo_config.json')
          )
          done();
        })
      })
    })
  })
})
