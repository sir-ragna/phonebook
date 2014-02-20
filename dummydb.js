/*global alert: true, console: true, Debug: true, exports: true, require: true */

// Dummy CLASS

var dataset = { command: 'SELECT',
      rowCount: 18,
      oid: NaN,
      rows: 
       [ { id: 1, name: 'Bert', tel: '7531' },
         { id: 2, name: 'Stijn', tel: '7545' },
         { id: 3, name: 'Tom', tel: '7111' },
         { id: 4, name: 'Walt', tel: '7445' },
         { id: 5, name: 'Jesse', tel: '0349' } ],
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
var delete_person = function(id, callback) {
    console.log("DELETING PERSON:" + id);
    dataset.rows.forEach(function(row) {
        if (id === row.id) {
            dataset.rows.splice(dataset.rows.indexOf(row), 1);
        }
    });
    callback(null);
};


var raw_query = function(query, success, failure) {
    // TODO query type and return dummy object.
    if (query === "SELECT * FROM persons") {
        success(dataset);
    } else {
        throw Error("Unimplemented in dummy object");
    } 
};


//pg.end(); // close down the pool.
exports.create_person = create_person;
exports.read_persons  = read_persons;
exports.update_person = update_person;
exports.delete_person = delete_person;
exports.print_persons = print_persons;
exports.close_pool    = function() { throw Error("Not Implemented yet"); };