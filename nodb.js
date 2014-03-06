/*global alert: true, console: true, Debug: true, exports: true, require: true */

// Dummy CLASS
// not really a datastore class. This is so I can just run the project without setting up an 
// postgres server.

var dataset = { command: 'SELECT',
      rowCount: 18,
      oid: NaN,
      maxID: 6,
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

// CRUD PERSON
var create_person = function(person, callback) {
    person.id = dataset.maxID;
    dataset.maxID++;
    dataset.rows.push(person);
    callback(null);
};

var read_persons = function(callback) {
    var persons = dataset.rows;
    callback(null, persons);
};

var read_person = function(id, callback) {
    var err = "PERSON NOT FOUND";
    var person = null;
    dataset.rows.forEach(function (row) {
        if (id === row.id) {
            person = row;
            err = null;
        }
    });
    console.log("READING PERSON: ");
    console.log(person);
    callback(err, person);
};

var update_person = function(person, callback) {
    var err = "COULD NOT UPDATE PERSON";
    dataset.rows.forEach(function (row) {
        if (person.id === row.id) {
            dataset.rows[dataset.rows.indexOf(row)] = person;
            err = null;
        }
    });
    callback(err, person);
};

var delete_person = function(id, callback) {
    var err = "PERSON NOT FOUND in Database";
    console.log("DELETING PERSON:" + id);
    dataset.rows.forEach(function(row) {
        if (id === row.id) {
            dataset.rows.splice(dataset.rows.indexOf(row), 1);
            err = null; // Person found, no error needed
        }
    });
    callback(err);
};


//pg.end(); // close down the pool.
exports.create_person = create_person;
exports.read_persons  = read_persons;
exports.read_person   = read_person;
exports.update_person = update_person;
exports.delete_person = delete_person;
exports.print_persons = print_persons;
exports.close_pool    = function() { throw Error("Not Implemented yet"); };