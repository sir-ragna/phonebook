var receive = require("./receive.js");
var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var templates = require("./templates.js");
var db = require("./db.js");

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

var index = function (request, response) {
    var body = [
		"<!DOCTYPE html>",
		"<html>",
		"<head>",
		"<meta http-env=\"Content-Type\" content=\"text/html;charset=UTF-8\" />",
		"</head>",
		"<body>",
		"<h1>Welcome to our homepage</h1>",
        "<p>This may very well become one of the most awesome pages in the world.</p>",
        '<a href="./start" title="go upload stuff">Have fun</a>',
		"</body>",
		"</html>"
	].join("\n");
    
    response.writeHead(200, {"Content-Type" : "text/html"});
	response.write(body);
	response.end();
};

exports.index = index;
exports.start = start;
exports.upload = upload;

