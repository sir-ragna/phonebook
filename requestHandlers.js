/*global alert: true, console: true, Debug: true, exports: true, require: true , process : true*/

var receive = require("./receive.js");
var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var templates = require("./templates.js");
var db = require("./postgresdb.js"); // TODO decide which DB to use based settings (or something like that)
var url = require("url");
var path = require("path");

var start = function (request, response) {
	console.log("Request Start was called");
    var get = receive.get(request);
	var template = templates.phonebook;
    var template_data = {
        title : "Phonebook",
        persons : []
    };
    
    // see if a notification has to be displayed on the page
    if (typeof get.notify !== 'undefined' ||
        typeof get.body !== 'undefined') {
        // TODO build in XSS protection
        // (this allow injection via the URL)
        template_data.notify = {
            type: get.notify,
            body: get.body
        };
    }
    
    // feed data into the template
    // First retrieve data
    db.read_persons( function(err, persons) {
        if (err) {
            console.error(err);
            _500_(request, response, err);
            return;
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
    // Expect a full person object from the GET
    // TODO: Fallback on POST?
    var get = receive.get(request);
    
    if (!(get.name && get.tel)) {
        response.writeHead(406, {"Content-Type" : "text/plain"});
        response.write("406 Not Acceptable\n");
        response.write("Needs a name and a tel paramater.\n");
        response.end();
        return;
    }
    
    db.create_person(get, function(err) {
        if (err) {
            _500_(request, response, err);
            return;
        }
        // Everything went alright redirect to default page
        var msg = "Successfully added " + get.name + "(" + get.tel + ")" + " to the phonebook.";
        var msgObject = { notify : 'success', body : msg };
        _303_(request, response, msgObject);
        return;
    });
};

var update_person = function(request, response) {
    
    var get = receive.get(request);
    var template = templates.edit;
    var template_data = {
        title: "Phonebook | Edit telephone entry"
    };
    var id = parseInt(get.id);
    var name = get.name;
    var tel = get.tel;
    
    if (!get.id || isNaN(id)) {
        // requires ID to be able to edit.
        console.error("No ID found");
        _404_(request, response);
        return;
    }
    
    if (!(name && tel)) {
        // name or tel are not present
        // read out entry from DB and present in form
        db.read_person( id, function(err, person) {
            if (err) {
                console.error(err);
                _404_(request, response, err);
                return;
            }
            template_data.id = person.id;
            template_data.name = person.name;
            template_data.tel = person.tel;
            var body = template(template_data);
            response.writeHead(200, {"Content-Type" : "text/html"});
            response.write(body);
            response.end();
            return;
        });
    } else if (name && tel) {
        db.update_person( { id : id, name: name, tel: tel }, function (err, person) {
            if (err) {
                // TODO notify user something failed
                _303_(request, response);
                return;
            }
            // TODO notify user the update succeded
            var msg = "Success! " + name + '(' + tel + ')' + "was updated in the phonebook";
            var msgObject = { notify : 'success', body : msg };
            _303_(request, response, msgObject);
            return;
        });
    }
};

var remove_person = function(request, response) {
    var get = receive.get(request); // returns GET object remove?id=12 <==> { id : '12' }
    var person_id = parseInt(get.id);
    
    if (!person_id) {
        // if not exists. Note: ID is case sensitive. remove?ID won't match this!
        // TODO change this to a warning on the user page
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("An error occured.\n" + 
                       "No readable ID given\n" +
                       "TODO change to redirect with warning.");
        response.end();
        return;
    }
        
    db.delete_person(person_id, function(err, output) {
        if (err) {
            // something went wrong
            console.error(err);
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write("An error occured.\n" + err.toString());
            response.end();
            return;
        }
        // everything went fine
        console.log(output);
        var msg = "Successfully removed a person";
        var msgObject = { notify : 'info', body : msg };
        _303_(request, response, msgObject);
    });
};

var static = function(request, response) {
    // serve static content
    var pathname = url.parse(request.url).pathname;
    var fullpath = path.join(process.cwd(), pathname);
    console.log(pathname);
    console.log(fullpath);
    fs.exists(fullpath, function (exists) {
        if (!exists) {
            _404_(request, response);
            return;
        }
        
        fs.stat(fullpath, function(err, stats) {
            if (err) {
                _500_(request, response, err);
                return;
            }
            if (stats.isDirectory()) {
                // TODO: Serve DIR listing (maybe)
                response.writeHead(200, {"Content-Type": "text/plain"});
                response.write("This is a DIR");
                response.end();
            } else if (stats.isFile()) {
                // Serve FILE actual file
                fs.readFile(fullpath, "utf-8", function (err, blob) {
                    if (err) {
                        _500_(request, response, err);
                        return;
                    }
                    console.log("Serving file");
                    // Todo detect file type for example: {"Content-Type": "text/css"}
                    response.writeHead(200, {});
                    response.write(blob, "utf-8");
                    response.end();
                });
            } else {
                // If not file nor directory, then what is?
                console.log(stats);
            }
        });
    });
};

var _500_ = function(request, response, err) {
    console.error("ERROR 500");
    console.error(err);
    response.writeHead(500, {"Content-Type": "text/plain"});
    response.write("An error internal server error occured.\n\n" + err.toString());
    response.end();
};

var _303_ = function(request, response, msgObject) {
    var location = "http://localhost:8080";
    if (msgObject) {
        location = location + "/?" + querystring.stringify(msgObject);
    }
    response.writeHead(303, {"Content-Type": "text/html", "location" :  location });
    response.end();    
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
exports.update_person = update_person;

