/* Templates cache files */
/* These calls will be Asychronous. They should be executed only once when the server starts up. The files should remain in memory.
*/
var fs = require("fs");

console.log("LOADING TEMPLATES");

var adrbook = fs.readFileSync("./template/adrbook.html");

console.log("FILES LOADED");

exports.adrbook = adrbook;
