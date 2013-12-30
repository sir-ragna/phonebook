/*global alert: true, console: true, Debug: true, exports: true, require: true */
var http = require("http");

var start = function (route) {
	var onRequest = function (request, response) {
        route.handle(request, response);
	};

	var server = http.createServer(onRequest);
	server.listen(8080);
	console.log("The server started.");
};

exports.start = start;

