/*global require: true, describe: true, it: true */

var assert = require("assert");
var http   = require("http");


describe("HTTP codes", function(){
    
    it('should return 200 when the server is active.', function(done){
        http.get('http://localhost:8080/', function(res){
            assert.equal(200, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 404 when requesting unexisting url.', function(done){
        http.get('http://localhost:8080/not-a-thing', function(res){
            assert.equal(404, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 303 when adding an entry.', function(done){
        http.get('http://localhost:8080/add/?name=Robbe+Van+der+Gucht&tel=%2B32+4+000+000', function(res){
            assert.equal(303, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 406 when forgetting tel param.', function(done){
        http.get('http://localhost:8080/add/?name=Robbe+Van+der+Gucht', function(res){
            assert.equal(406, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 406 when forgetting name param.', function(done){
        http.get('http://localhost:8080/add/?tel=%2B32+4+000+000', function(res){
            assert.equal(406, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 500 when trying to remove nothing.', function(done){
        http.get('http://localhost:8080/remove/', function(res){
            assert.equal(500, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 500 when trying to remove non-existent person.', function(done){
        http.get('http://localhost:8080/remove/?id=9000', function(res){
            assert.equal(500, res.statusCode);
            done();
        });
    }, 50);
    
});