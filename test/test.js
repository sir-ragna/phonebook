/*global require: true, describe: true, it: true */

var assert = require("assert");
var http   = require("http");

var url = "http://localhost:8080";

describe("HTTP codes", function(){
    
    it('should return 200 when the server is active.', function(done){
        http.get(url + '/', function(res){
            assert.equal(200, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 404 when requesting unexisting url.', function(done){
        http.get(url + '/not-a-thing', function(res){
            assert.equal(404, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 303 when adding an entry.', function(done){
        http.get(url + '/add/?name=Robbe+Van+der+Gucht&tel=%2B32+4+000+000', function(res){
            assert.equal(303, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 406 when forgetting tel param.', function(done){
        http.get(url + '/add/?name=Robbe+Van+der+Gucht', function(res){
            assert.equal(406, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 406 when forgetting name param.', function(done){
        http.get(url + '/add/?tel=%2B32+4+000+000', function(res){
            assert.equal(406, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 500 when trying to remove nothing.', function(done){
        http.get(url + '/remove/', function(res){
            assert.equal(500, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 500 when trying to remove non-existent person.', function(done){
        http.get(url + '/remove/?id=9000', function(res){
            assert.equal(500, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 200 when requesting the CSS file', function(done){
        http.get(url + '/bootstrap/css/bootstrap.min.css', function(res){
            assert.equal(200, res.statusCode);
            done();
        });
    }, 50);
    
    it('should return 404 when requesting a non-existant file', function(done){
        http.get(url + '/bootstrap/css/nonexistantfile.wut', function(res){
            assert.equal(404, res.statusCode);
            done();
        });
    }, 50);
    
});