/*global alert: true, console: true, Debug: true, exports: true, require: true , process : true*/

var receive = require("./receive.js");
var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var templates = require("./templates.js");
var db = require("./db.js");
var url = require("url");
var path = require("path");

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
    var fullpath = path.join(process.cwd(), pathname);
    console.log(pathname);
    console.log(fullpath);
    fs.exists(fullpath, function (exists) {
        if (exists) {
            fs.stat(fullpath, function(err, stats) {
                if (err) {
                    console.error(err);
                    // serve appropriate http errorcode
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write("An error occured. " + err);
                    response.end();
                    return;
                }
                if (stats.isDirectory()) {
                    // TODO: Serve DIR listing (maybe)
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    response.write("This is a DIR");
                    response.end();
                } else if (stats.isFile()) {
                    // Serve FILE
                    // TODO detect content types on file extension
                    fs.readFile(fullpath, "utf-8", function (err, blob) {
                        if (err) {
                            console.error(err);
                            // serve appropriate http errorcode
                            response.writeHead(500, {"Content-Type": "text/plain"});
                            response.write("Could not read file.\n An error occured. " + err);
                            response.end();
                            return;
                        }
                        console.log("Serving file");
                        response.writeHead(200, { });
                        //response.writeHead(200, {"Content-Type": "text/css"});
                        response.write(blob, "utf-8");
                        response.end();
                    });
                } else {
                    console.log(stats);
                }
            });
        } else {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("File does not exist.");
            response.end();
        }
    });
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

