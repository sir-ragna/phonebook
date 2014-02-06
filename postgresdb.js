/*global alert: true, console: true, Debug: true, exports: true, require: true */
var pg = require('pg');
var conString = "postgres://per_admin@192.168.1.5/persons";

// CRUD PERSON
var create_person = function(person, callback) {
    var statement = "INSERT INTO persons (name, tel) VAlUES ( $1, $2 );";
    var params = [ person.name, person.tel ];
    execute_query(statement, params, function(err, output) {
        if (err) {
            console.error("COULD NOT CREATE PERSON\n" + output);
        } else if (output) {
            console.log("PERSON CREATED");
            console.log(output);
        } else {
            // Oops?
            console.error("NO ERR OR OUTPUT was returned!?");
        }
        
        // Call callback if exists
        if (typeof callback === 'function'){
            callback(err, output);
        }

    }); 
};

var read_persons = function(callback) {
    var query = "SELECT * FROM persons";
    execute_query(query, null, callback); 
};

var read_person = function(id, callback) { throw Error("Not implemented yet"); };
var update_person = function(person, callback) { throw Error("Not implemented yet"); };
var delete_person = function(person, callback) { throw Error("Not implemented yet"); };

var print_persons = function(){
    read_persons( function(err, result) {
        if (err) {
            console.error("COULD NOT READ persons\n" + err);
        } else {
            console.log("\n##RESULT##\n");
            //console.log(result);
            print_select_result_table(result);
        }
    }); 
};

var print_select_result_table = function(select_result) {
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
    
    console.log(output);
};

var execute_query = function (statement, params, callback){
    console.info("QUERY:" + statement);
    pg.connect(conString, function(err, client, done) {
        if (err) {
            /* Give more details about the connection problem */
            console.warn("COULD NOT CONNECT TO DB:: " + conString + "::");
            callback(err);
        } else {
            if (params === null || params === undefined) {
                client.query(statement, function(err, result){
                    done(); // release client to pool
                    callback(err, result);
                });
            } else {
                client.query(statement, params, function(err, result){
                    done(); // release client to pool
                    callback(err, result);
                });
            }
        }

    });
};

var close_pool = function () {
    pg.end();
};

//pg.end(); // close down the pool.
exports.create_person = create_person;
exports.read_persons  = read_persons;
exports.update_person = update_person;
exports.delete_person = delete_person;
exports.print_persons = print_persons;
exports.close_pool    = close_pool;