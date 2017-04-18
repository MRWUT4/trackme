import * as SQL from 'sql.js';
import * as fs from 'fs';

// var sql = require( 'sql.js' );

export class LocalSQLite
{
  get path():string
  {
    return this.name + '.sqlite';
  }

  get db():any
  {
    try
    {
      var filebuffer = fs.readFileSync( this.path );
      var db = new SQL.Database( filebuffer );
    }
    catch( error )
    {
      console.log( "ERROR READING FILE" );
    }
  }

  constructor(private name:String)
  {
    console.log( fs );
    console.log( SQL );
    // var fs = require('fs');
    // var SQL = require('sql.js');


    //
    // // Load the db


    // var sql = require( 'sql.js' );
    // // or sql = window.SQL if you are in a browser
    //
    // // Create a database
    // var db = new sql.Database();
    //
    //
    // // Run a query without reading the results
    // db.run("CREATE TABLE test (col1, col2);");
    // // Insert two rows: (1,111) and (2,222)
    // db.run("INSERT INTO test VALUES (?,?), (?,?)", [1,111,2,222]);
    //
    //
    // var fs = require("fs");
    // // [...] (create the database)
    // var data = db.export();
    // var buffer = new Buffer(data);
    // fs.writeFileSync("filename.sqlite", buffer);
  }
}
