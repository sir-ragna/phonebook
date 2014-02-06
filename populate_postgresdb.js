/*global alert: true, console: true, Debug: true, exports: true, require: true, setTimeout: true */
// populate DB with some values

var db = require("./postgresdb.js");

//db.create_person({ name : "Ine", tel: "+32 4 00 00 00"});
//db.create_person({ name : "Sofie", tel: "+32 4 00 00 00"}, function(result){});
db.print_persons();
// Close the pool after One second

setTimeout( function() {
    db.close_pool();
}, 1000);
