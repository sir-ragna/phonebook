/*global alert: true, console: true, Debug: true, exports: true, require: true */
var url = require("url");
var querystring = require("querystring");

// some helper functions to receive data from the client

// Receive post data
var receivePostData = function (request, callback) {
    // Helper function that gathers the post data
    var postData = "";
    request.setEncoding("utf8");
    request.addListener("data", function (chunk) {
        postData += chunk;
    });
    request.addListener("end", function () {
        // called when all chunks of data have been received
        callback(postData); // note: postData is still querystring encoded
    });
};


var parseGetRequest = function (request) {
    request.setEncoding("utf8");
    var getObject = querystring.parse(url.parse(request.url).query);
    return getObject;
};

exports.post = receivePostData;
exports.get = parseGetRequest;