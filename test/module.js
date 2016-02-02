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

    it('should fail on a bad dir', function(done) {
      al.init('asdfasdfkjalsf', function(e) {
        should.exist(e);
        done()
      })
    })

  })


  describe('add', function () {

    it('should add a single file', function (done){
      var f = path.join(test_util.dir, 'a.txt')
      al.add(f, function (e, addedFiles) {
        should.not.exist(e)
        addedFiles.should.have.lengthOf(1);
        addedFiles.should.containEql(f)
        done();
      })
    })

    it('should add all files in a directory', function (done) {
      var d = path.join(test_util.dir, 'subdir')
      al.add(d, function(e, addedFiles) {
        should.not.exist(e)
        addedFiles.should.have.lengthOf(2);
        addedFiles.should.containEql(d);
        addedFiles.should.containEql(path.join(d, 'b.txt'));
        done();
      })
    })

    it('should add multiple files', function (done) {
      var files = [
        path.join(test_util.dir, 'm1.txt'),
        path.join(test_util.dir, 'm2.txt')
      ]
      al.add(files, function (e, addedFiles) {
        should.not.exist(e)
        addedFiles.should.have.lengthOf(2);
        addedFiles.should.containEql(files[0])
        addedFiles.should.containEql(files[1])
        done();
      })
    })

    it('should ignore ignored files', function(done) {
      al.add(path.join(test_util.dir, 'ignored_subdir', 'b.txt'), function(e, addedFiles) {
        should.not.exist(e)
        addedFiles.should.have.lengthOf(0)
        done();
      })
    })

    it('should fail on bogus file', function(done) {
      al.add('asdpfijasfls', function(e) {
        should.exist(e)
        done();
      })
    })

  })


  describe('unadd', function() {

    it('should unadd a single file', function (done){
      var f = path.join(test_util.dir, 'a.txt')
      al.unadd(f, function (e, addedFiles) {
        should.not.exist(e)
        addedFiles.should.have.lengthOf(1);
        addedFiles.should.containEql(f)
        done();
      })
    })

    it('should unadd all files in a directory', function (done) {
      var d = path.join(test_util.dir, 'subdir')
      al.unadd(d, function(e, addedFiles) {
        should.not.exist(e)
        addedFiles.should.have.lengthOf(2);
        addedFiles.should.containEql(d);
        addedFiles.should.containEql(path.join(d, 'b.txt'));
        done();
      })
    })

    it('should unadd multiple files', function (done) {
      var files = [
        path.join(test_util.dir, 'm1.txt'),
        path.join(test_util.dir, 'm2.txt')
      ]
      al.unadd(files, function (e, addedFiles) {
        should.not.exist(e)
        addedFiles.should.have.lengthOf(2);
        addedFiles.should.containEql(files[0])
        addedFiles.should.containEql(files[1])
        done();
      })
    })

    it('should ignore ignored files', function(done) {
      al.unadd(path.join(test_util.dir, 'ignored_subdir', 'b.txt'), function(e, addedFiles) {
        should.not.exist(e)
        addedFiles.should.have.lengthOf(0)
        done();
      })
    })

    it('should fail on bogus file', function(done) {
      al.unadd('asdpfijasfls', function(e) {
        should.exist(e)
        done();
      })
    })
  })


  describe('status', function() {
    it('should return all files with non-clean status', function(done) {
      al.status(function(e, status) {
        should.not.exist(e)
        
      })
    })
  })
})
