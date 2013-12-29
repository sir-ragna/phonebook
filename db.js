var pg = require('pg');
var conString = "postgres://per_admin@192.168.3.101/persons";

var success = function(res){
    if (res.command === "SELECT"){
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

var insert_person = function(name, tel) {
    /* Insert a person */
    var statement = "INSERT INTO persons (name, tel) VAlUES ( $1, $2 );";
    var params = [ name, tel ];
    safe_query(statement, params, function(msg){ console.log("insert succes");}, failure);    
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
//print_persons();
pg.end(); // close down the pool.
exports.query = safe_query;