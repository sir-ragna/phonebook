/*global alert: true, console: true, Debug: true, exports: true, require: true */

var url = require("url");

var routes = [];
var patterns = [];

var addRoute = function (pattern, route) {
    routes.push(route);
    patterns.push(new RegExp(pattern));
};

var handle = function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var i = patterns.length;
    while (i--) {
        var pattern = patterns[i];
        if (pattern.test(pathname)) {
            // if pattern matches url, execute the appropriate route
            routes[i](request, response);
            return; // Don't execute multiple routes.
        }
    }
    // only gets executed when no route has been found
    
};

exports.handle = handle;
exports.addRoute = addRoute;