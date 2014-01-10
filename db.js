/*global alert: true, console: true, Debug: true, exports: true, require: true */

var pg = require('pg');
var conString = "postgres://per_admin@192.168.3.100/persons";

var success = function(res){
    if (res.command === "SELECT"){
        console.log(res);
        res.rows.forEach(function(row){
            console.log(row);
        });
    } else {
        console.log(res);
    }
};

var failure = function(err){
    console.error(err);
};

var dummy_select = function(query, success, failure){
    var result = { command: 'SELECT',
          rowCount: 18,
          oid: NaN,
          rows: 
           [ { name: 'Bert', tel: '7531' },
             { name: 'Bert', tel: '7531' },
             { name: 'Stijn', tel: '7545' },
             { name: 'Tom', tel: '7531' },
             { name: 'Tom', tel: '7111' },
             { name: 'Walt', tel: '7445' },
             { name: 'Walt', tel: '7445' },
             { name: 'Tom', tel: '7111' },
             { name: 'Jesse', tel: '0349' },
             { name: 'Walt', tel: '7445' },
             { name: 'Tom', tel: '7111' },
             { name: 'Jesse', tel: '0349' },
             { name: 'Walt', tel: '7445' },
             { name: 'Jesse', tel: '0349' },
             { name: 'Tom', tel: '7111' },
             { name: 'Walt', tel: '7445' },
             { name: 'Tom', tel: '7111' },
             { name: 'Jesse', tel: '0349' } ],
          fields: 
           [ { name: 'name',
               tableID: 16386,
               columnID: 1,
               dataTypeID: 1043,
               dataTypeSize: -1,
               dataTypeModifier: 84,
               format: 'text' },
             { name: 'tel',
               tableID: 16386,
               columnID: 2,
               dataTypeID: 1043,
               dataTypeSize: -1,
               dataTypeModifier: 19,
               format: 'text' } ],
          _parsers: [ [Function], [Function] ],
          RowCtor: [Function] };
    
};

var del_person = function(name) {
    var statement = "DELETE FROM persons WHERE name = $1;";
    var params = [ name ];
    safe_query(statement, params, function(msg) {
        console.log("REMOVED: " + name + "\n" + msg);
    }, failure);
};

var insert_person = function(name, tel) {
    /* Insert a person */
    var statement = "INSERT INTO persons (name, tel) VAlUES ( $1, $2 );";
    var params = [ name, tel ];
    safe_query(statement, params, function(msg){ 
        console.log("insert succes");
    }, failure);    
};

var print_persons = function(){
    var query = "SELECT * FROM persons";
    raw_query(query, success, failure); 
};

var safe_query = function (statement, params, success, failure){
    console.info("QUERY:" + statement);
    pg.connect(conString, function(err, client, done) {
        if (err) {
            // connection error, could not fetch client from pool
            failure(err);
            return;
        }
        client.query(statement, params, function(err, result){
            done(); // release client to pool
            if (err) {
                // query execution error
                failure(err);
                return;
            }
            success(result); // Everything succeeded. Proceed.
        });
    });
};

var raw_query = function(query, success, failure) {
    console.info("QUERY:" + query);
    pg.connect(conString, function(err, client, done) {
        if (err) {
            failure(err);
            return;
        }
        client.query(query, function(err, result){
            done();
            if (err) {
                failure(err);
                return;
            }
            success(result);            
        });

    });
};

//insert_person("Walt", "7445" );
//insert_person("Tom", "7111" );
//insert_person("Jesse", "0349");
//insert_person("Robbe", "204303");
//print_persons();
//del_person("Robbe");
//pg.end(); // close down the pool.
exports.query = safe_query;
exports.del_person = del_person;