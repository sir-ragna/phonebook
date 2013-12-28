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
        response.writeHead(200, {"Content-Type" : "text/plain"});
        response.write("You've send: " + err);
        response.end();
    });

};

var upload = function (request, response) {
	console.log("Request Upload was called");
    receive.post(request, function (postData) {
        // When we received the Postdata we construct the response.
        
        var txt = querystring.parse(postData).text; // decode query string
        if (txt !== undefined) { // if there is a response
            response.writeHead(200, {"Content-Type" : "text/plain"});
            response.write("You've send: " + txt);
            response.end();
                        
        } else { // if post data was received
            response.writeHead(200, {"Content-Type" : "text/plain"});
            response.write("You didn't send anything?");
            response.end();
        }
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

