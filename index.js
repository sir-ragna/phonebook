/*global Buffer: false, clearInterval: false, clearTimeout: false, console: true, exports: true, global: false, module: false, process: false, querystring: false, require: true, setInterval: false, setTimeout: false, __filename: false, __dirname: false */

var server = require("./server.js");
var router = require("./router.js");
var requestHandlers = require("./requestHandlers.js");

router.addRoute("^/$", requestHandlers.start);
router.addRoute("^/list/?$", requestHandlers.start);
router.addRoute("^/bootstrap/?.*", requestHandlers.static);

server.start(router);

