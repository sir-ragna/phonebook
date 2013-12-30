/*global alert: true, console: true, Debug: true, exports: true, require: true */

var server = require("./server.js");
var router = require("./router.js");
var requestHandlers = require("./requestHandlers.js");

router.addRoute("^/$", requestHandlers.start);
router.addRoute("^/list/?$", requestHandlers.start);
router.addRoute("^/bootstrap/?.*$", requestHandlers.static);

server.start(router);

