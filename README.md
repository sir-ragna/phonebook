
# Phonebook

## What is this?

This is mainly an educational project to learn myself de basics of `node`. My 
attempt was to make a basic CRUD program. Create, Read, Update and Delete 
telephone numbers is possible. It is dependent on a PostgreSQl server but you 
can also run it without datastorage by chaning the line `var db = 
require("./postgresdb.js");` to `./nodb.js`(in the `requestHandlers.js`file) so It'll run simply on 
some records held in RAM.

## How to run this?

Running this on an Ubuntu or Debian machine would require roughly these 
commands.

    sudo -i
    aptitude install git build-essential -y
    git clone https://github.com/joyent/node.git
    git checkout v0.10.26
    ./configure && make && make install
    git clone https://github.com/sir-ragna/<this repo>.git
    npm install # this should install all dependencies (package.json)
    exit # exit root
    sed -i 's/postgresdb.js/nodb.js/' requestHandlers.js # don't use DB
    node index.js

If you want to run the tests you'll also have to install mocha (globally).

    npm -g install mocha
    mocha


### Postgres

If you want the full experience you'll have to install a postgres DB server. I 
installed mine on a virtual machine.

    createdb persons
    createuser per_admin

    echo listen = '*' >>  postgresql.conf
    echo host persons per_admin 192.168.3.0/24 trust >> pg_hba.conf 

Log in en create table

    persons=\# CREATE TABLE persons ( id bigserial primary key, name varchar(80), tel varchar(15) );

Fill your own connectionstring in `postgresdb.js`

    var conString = "postgres://per_admin@192.168.3.100/persons";


## Ideas to explore with this project (possible todo list)

- use SSL, fallback?
- option to cache static files like stylesheets. Although I do expect my OS to 
  already cache them when memory is available. 
- try this with NGINX
- create authentication scheme
- Roles authentications
- XSS vulnerabilities? (tons probably)
- SQL-injection vuln? Should not be possible. (notify me)
- exploits? (You can probably crash it in a thousand ways, I didn't put effort 
  in security at all)
- login name hashing for storing? (would hash+salt storing have a use case?)

