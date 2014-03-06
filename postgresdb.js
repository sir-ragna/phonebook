/*global alert: true, console: true, Debug: true, exports: true, require: true */
var pg = require('pg');
var conString = "postgres://per_admin@192.168.5.104/persons";

// CRUD PERSON
var create_person = function(person, callback) {
    var statement = "INSERT INTO persons (name, tel) VAlUES ( $1, $2 );";
    var params = [ person.name, person.tel ];
    execute_query(statement, params, function(err, output) {
        // Call callback if exists
        if (typeof callback === 'function'){
            callback(err, output);
        }

    }); 
};

var read_persons = function(callback) {
    var statement = "SELECT * FROM persons";
    execute_query(statement, null, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        if (typeof callback === 'function') {
            callback( err, result.rows );
        }
    });
};

// id, callback(err, persons<list>)
var read_person = function(id, callback) {
    var statement = "SELECT * FROM persons WHERE id = $1";
    execute_query(statement, [ id ], function(err, result){
        if (err) {
            callback(err);
        }
        var person = result.rows[0];
        callback(err, person);
    });
};

var update_person = function(person, callback) {
    var statement = "UPDATE persons SET name = $2, tel = $3 WHERE id = $1";
    var params = [ person.id, person.name, person.tel ];
    execute_query(statement, params, function(err, output) {        
        if (!err && output.rowCount === 0) {
            // No rows where modified !!!
            console.info(output.command + " || " + "No rows updated");
            err = "PERSON MIGHT NOT EXIST, NO ROWS WERE UPDATED";
        }
        
        // Call callback
        if (typeof callback === 'function'){
            callback(err, output);
        }
    });
};

var delete_person = function(id, callback) {
    var statement = "DELETE FROM persons WHERE id = $1";
    execute_query(statement, [ id ], function(err, output){
        if (!err && output.rowCount === 0) {
            // No rows where modified !!!
            console.info(output.command + " || " + "No rows updated/removed");
            err = "PERSON MIGHT NOT EXIST, NO ROWS WERE REMOVED";
        }

        // Call callback
        if (typeof callback === 'function'){
            callback(err, output);
        }
    });
};

// print the table persons to the console
var print_persons = function(callback){
    execute_query("SELECT * FROM persons", null, function(err, result) {
        if (err) {
            console.error("COULD NOT READ persons\n" + err);
        } else {
            console.log("\n##RESULT##\n");
            console.log(printable_result_table(result));
        }
        if (typeof callback === 'function') {
            callback(err);
        }
    }); 
};

// Construct a printable ASCII table
var printable_result_table = function(select_result) {
    var fields = [];
    var col_lengths = [];
    var output = "";

    // What are the field names and what is their length
    select_result.fields.forEach( function (field) {
        col_lengths.push(field.name.length);
        fields.push(field.name);
    });
    
    // Find the maximum length of each column
    var rows = select_result.rows;
    rows.forEach( function (row) {
        fields.forEach( function(field) {
            var ind = fields.indexOf(field);
            var len = row[field].length;
            if ( len > col_lengths[ind] ){
                col_lengths[ind] = len;
            }
        });
    });
    
    // What is the total length? 
    var max_length = 0;
    max_length += fields.length + 1; // for the separators
    col_lengths.forEach( function( col_len ) {
        max_length += col_len;
    });
    
    // Draw the first line.
    for (var i = max_length; i > 0; i--) {
        output += "-";
    }
    output += "\n"; // This was the first line
   
    // Print the Headers
    fields.forEach( function( field ) {
        output += "|" + field;
        var ind = fields.indexOf(field);
        var length_to_fill_up_with_spaces = col_lengths[ind] - field.length;
        
        // fill up the rest of the column row up with spaces for nice alignement
        for (;length_to_fill_up_with_spaces > 0; length_to_fill_up_with_spaces-- ) {
            output += " ";
        }
    });
    output += "|\n";
    
    // print the actual lines in the table (finally -_-)
    rows.forEach( function (row) {
        fields.forEach( function( field ) {
            output += "|" + row[field]; // actual column content
            
            var ind = fields.indexOf(field);
            var length_to_fill_up_with_spaces = col_lengths[ind] - (row[field].length);
            
            // fill up the rest of the column row up with spaces for nice alignement
            for (;length_to_fill_up_with_spaces > 0; length_to_fill_up_with_spaces-- ) {
                output += " ";
            }
        });
        output += "|\n";
    });
    
    // finish with another line
    // Draw the first line.
    for (i = max_length; i > 0; i--) {
        output += "-";
    }
    
    return(output);
};

var execute_query = function (statement, params, callback){
    console.info("QUERY:" + statement);
    pg.connect(conString, function(err, client, done) {
        if (err) {
            /* Give more details about the connection problem */
            console.warn("COULD NOT CONNECT TO DB [[ " + conString + " ]]");
            callback(err);
        } else {
            if (params === null || params === undefined) {
                client.query(statement, function(err, result){
                    done(); // release client to pool
                    callback(null, result);
                });
            } else {
                client.query(statement, params, function(err, result){
                    done(); // release client to pool
                    callback(null, result);
                });
            }
        }

    });
};

var close_pool = function () {
    // Closing the pool makes sure that the application can finish
    pg.end();
};

//pg.end(); // close down the pool.

exports.close_pool    = close_pool;
exports.create_person = create_person;
exports.read_persons  = read_persons;
exports.read_person   = read_person;
exports.update_person = update_person;
exports.delete_person = delete_person;
exports.print_persons = print_persons;