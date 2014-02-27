/*global alert: true, console: true, Debug: true, exports: true, require: true */

/* Templates cache files */
/* These calls will be Asychronous. They should be executed only once when the server starts up. The files should remain in memory.
*/
var fs = require("fs");
var hb = require("handlebars");

console.log("LOADING TEMPLATES");

var list = hb.compile(fs.readFileSync("./template/list.html", "utf-8"));
var edit = hb.compile(fs.readFileSync("./template/edit.html", "utf-8"));

console.log("FILES LOADED & TEMPLATES COMPILED");

exports.adrbook = list;
exports.edit = edit;
