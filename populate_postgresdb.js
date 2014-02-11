/*global alert: true, console: true, Debug: true, exports: true, require: true, setTimeout: true */
// populate DB with some values

var db = require("./postgresdb.js");

//db.create_person({ name : "Ine", tel: "+32 4 00 00 00"});
//db.create_person({ name : "Sofie", tel: "+32 4 00 00 00"}, function(result){});

db.print_persons( function (err) {    
    db.delete_person( 6, function (err, output) {
        if (err) {
            console.error(err);
        }
        console.log(output);
        db.print_persons();
        db.update_person({ id: 6, name : "Liesje", tel : "+32 4 11 22 32"}, function (err, output) {
            if (err) {
               // something went wrong
                console.error(err);
            }
            db.print_persons();
        });
    });

    db.read_persons(function(err, persons){
        if (err){
            console.error(err);
        }
        //console.log(persons);
    });
});

// Close the pool after One second
setTimeout( function() {
    db.print_persons( function (err) {
        db.close_pool();
    });
}, 1000);
