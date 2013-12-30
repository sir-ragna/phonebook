/*global alert: true, console: true, Debug: true, exports: true, require: true */

var receive = require("./receive.js");
var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var templates = require("./templates.js");
var db = require("./db.js");
var url = require("url");

var start = function (request, response) {
	console.log("Request Start was called");
	var template = templates.adrbook;
    // feed data into the template
    // First retrieve data
    db.query("SELECT * FROM persons", [], function(result){
        // succes
        console.log(result);
        var body = template(result);
        response.writeHead(200, {"Content-Type" : "text/html"});
        response.write(body);
        response.end();
    }, function(err) {
        // failure
        console.error(err);
        response.writeHead(500, {"Content-Type" : "text/plain"});
        response.write("INTERNAL SERVER ERROR \n" + err);
        response.end();
    });

};

var static = function(request, response) {
    // serve static content
     var pathname = url.parse(request.url).pathname;
	console.log("About to route a request for " + pathname);
};

var _404_ = function(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.warn("Path not found: " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
};


exports.start = start;
exports._404_ = _404_;
exports.static = static;

