/* Templates cache files */
/* These calls will be Asychronous. They should be executed only once when the server starts up. The files should remain in memory.
*/
var fs = require("fs");
var hb = require("handlebars");

console.log("LOADING TEMPLATES");

var adrbook = hb.compile(fs.readFileSync("./template/adrbook.html", "utf-8"));

console.log("FILES LOADED & TEMPLATES COMPILED");

exports.adrbook = adrbook;
