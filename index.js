/*global alert: true, console: true, Debug: true, exports: true, require: true */

var server = require("./server.js");
var router = require("./router.js");
var requestHandlers = require("./requestHandlers.js");

router.addRoute("^/$", requestHandlers.start);
router.addRoute("^/list/?$", requestHandlers.start);
router.addRoute("^/bootstrap/?.*$", requestHandlers.static);
router.addRoute("^/remove/?.*$", requestHandlers.remove_person);
router.addRoute("^/add/?.*$", requestHandlers.add_person);
router.addRoute("^/(?:edit|update)/?.*$", requestHandlers.update_person);

server.start(router);

