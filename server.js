var http = require("http");

var start = function (route, handle) {
	var onRequest = function (request, response) {
        route(handle, request, response);
	};

	server = http.createServer(onRequest);
	server.listen(8080);
	console.log("The server started.");
};

exports.start = start;

