/*global alert: true, console: true, Debug: true, exports: true, require: true , process : true*/

var receive = require("./receive.js");
var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var templates = require("./templates.js");
var db = require("./dummydb.js"); // TODO decide which DB to use based settings (or something like that)
var url = require("url");
var path = require("path");


var start = function (request, response) {
	console.log("Request Start was called");
	var template = templates.adrbook;
    var template_data = {
        title : "Telephone booke",
        persons : []
    };
    // feed data into the template
    // First retrieve data
    db.read_persons( function(err, persons) {
        if (err) {
            // something went wrong
            console.error(err);
            response.writeHead(500, {"Content-Type" : "text/plain"});
            response.write("INTERNAL SERVER ERROR \n" + err);
            response.end();
            return; // stop execution
        }
        // succes
        template_data.persons = persons;
        console.log("__PERSONS__");
        console.log(persons);
        var body = template(template_data);
        response.writeHead(200, {"Content-Type" : "text/html"});
        response.write(body);
        response.end();
    });

};

var add_person = function(request, response) {
        var err = "Not implemented yet";
        response.writeHead(500, {"Content-Type" : "text/plain"});
        response.write("INTERNAL SERVER ERROR \n" + err);
        response.end();
};

var remove_person = function(request, response) {
    var get = receive.get(request); // returns GET object remove?id=12 <==> { id : '12' }
    console.log(get);
    var person_id = parseInt(get.id);
    
    if (!person_id) {
        // if not exists. Note: ID is case sensitive. remove?ID won't match this!
        
        // TODO change this to a warning on the user page
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("An error occured.\n" + 
                       "Person does not exist\n" +
                       "TODO change to redirect with warning.");
        response.end();
        return;
    }
    
    var redir_url = "http://localhost:8080/";
    if (request.headers.referer !== undefined) {
        redir_url = request.headers.referer;
        // Thanks Ine for helping me find this bug :-)
    }
    
    db.delete_person(person_id, function(err, output) {
        if (err) {
            // something went wrong
            console.error(err);
            response.writeHead(303, {"Content-Type": "text/html",
                                     "location" : redir_url });
            response.end();
            return;
        }
        // everything went fine
        console.log(output);
        console.error(err);
        console.log(request.headers.referer);
        
        response.writeHead(303, {"Content-Type": "text/html",
                                 "location" : redir_url });
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
exports.remove_person = remove_person;
exports.add_person = add_person;

