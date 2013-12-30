/*global Buffer: false, clearInterval: false, clearTimeout: false, console: true, exports: true, global: false, module: false, process: false, querystring: false, require: true, setInterval: false, setTimeout: false, __filename: false, __dirname: false */

/* Templates cache files */
/* These calls will be Asychronous. They should be executed only once when the server starts up. The files should remain in memory.
*/
var fs = require("fs");
var hb = require("handlebars");

console.log("LOADING TEMPLATES");

var adrbook = hb.compile(fs.readFileSync("./template/adrbook.html", "utf-8"));

console.log("FILES LOADED & TEMPLATES COMPILED");

exports.adrbook = adrbook;
