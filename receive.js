/*global Buffer: false, clearInterval: false, clearTimeout: false, console: true, exports: true, global: false, module: false, process: false, querystring: false, require: true, setInterval: false, setTimeout: false, __filename: false, __dirname: false */

// some helper functions to receive data from the client

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


exports.post = receivePostData;