/*global alert: true, console: true, Debug: true, exports: true, require: true */

// Dummy CLASS

var dataset = { command: 'SELECT',
      rowCount: 18,
      oid: NaN,
      rows: 
       [ { name: 'Bert', tel: '7531' },
         { name: 'Stijn', tel: '7545' },
         { name: 'Tom', tel: '7111' },
         { name: 'Walt', tel: '7445' },
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



var print_persons = function(){
    console.log(dataset.rows);
};

var safe_query = function (statement, params, success, failure){
    if (statement.substring(0, 8) === "SELECT *") {
        success(dataset);
    } else if (statement.substring(0, 6) === "INSERT") {
        //insert_person( params[0], params[1]);
        throw Error("Unimplemented in dummy object");
    } else {
        throw Error("Unimplemented in dummy object");
    }
    
    
};

// CRUD PERSON
var create_person = function(person, callback) {
    dataset.rows.push(person);
    callback(null);
};

var read_persons = function(callback) {
    var persons = dataset.rows;
    callback(null, persons);
};

var read_person = function(id, callback) { throw Error("Not implemented yet"); };

var update_person = function(person, callback) { throw Error("Not implemented yet"); };
var delete_person = function(person, callback) { throw Error("Not implemented yet"); };


var raw_query = function(query, success, failure) {
    // TODO query type and return dummy object.
    if (query === "SELECT * FROM persons") {
        success(dataset);
    } else {
        throw Error("Unimplemented in dummy object");
    } 
};


//pg.end(); // close down the pool.
exports.query = safe_query;