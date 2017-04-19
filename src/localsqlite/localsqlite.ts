import * as fs from 'fs';
import { ValuePair } from './valuepair';
// import * as SQL from 'sql.js';
let SQL = require( 'sql.js' );


export class LocalSQLite
{
  private _db:any;

  private getSQLTableExists:Function;
  private save:Function;

  public insert:Function;


  /*
   * Getter / Setter
   */

  get path():string
  {
    return this.name + '.sqlite';
  }

  get db():any
  {
    if( !this._db )
    {
      try
      {
        var filebuffer = fs.readFileSync( this.path );
        this._db = new SQL.Database( filebuffer );
      }
      catch( error )
      {
        this._db = new SQL.Database();
      }
    }

    return this._db;
  }


  getSQLType(value:any)
  {
    var type = typeof( value );

    switch( type )
    {
      case 'number':

        var isInteger = value % 1 == 0;
        return isInteger ? 'int' : 'float';

      case 'string':
        return 'text'
    }
  }

  getSQLStringCreateTable(tableID:String, valuePairs:ValuePair[]):String
  {
    var fields:String = '';

    valuePairs.forEach( (valuePair, index) =>
    {
        var prefix = index == 0 ? '' : ', ';
        var type = this.getSQLType( valuePair.value );

        fields += prefix + valuePair.property + ' ' + type;
    });


    var sqlString = `CREATE TABLE ${ tableID } ( ${ fields } );`;

    return sqlString;
  }

  getSQLStringInsertListObjectData(tableID:String, list:any[]):String
  {
    var sqlString = '';

    list.forEach( element =>
    {
      var values = '';

      element.forEach( (valuePair, index) =>
      {
        var prefix = index == 0 ? '' : ', ';
        values += prefix + valuePair.value;
      });

      sqlString += `INSERT INTO ${ tableID } VALUES ( ${ values } );\n`;
    })

    return sqlString;
  }

  sortByProperty(a:ValuePair, b:ValuePair):number
  {
    var valueA = a.property.toUpperCase();
    var valueB = b.property.toUpperCase();

    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0 ;
  }

  getDataTableFromObjectList(list:Object[]):Array<any>
  {
    var result = [];

    list.forEach( element =>
    {
      var pairs:ValuePair[] = [];

      for( var property in element )
      {
        var value = element[ property ];
        var pair = new ValuePair( property, value );

        pairs.push( pair );
      }

      pairs = pairs.sort( this.sortByProperty );

      result.push( pairs );
    });

    return result;
  }


  /*
   * Public interface.
   */

  constructor(private name:String)
  {
    var db = this.db;

    this.getSQLTableExists = this.curryGetSQLTableExists( db );
    this.save = this.currySave( db, this.path );
    this.insert = this.curryInsert( db );
  }


  currySave(db:any, path:string):Function
  {
    return ():void =>
    {
      var data = db.export();
      var buffer = new Buffer( data );

      fs.writeFileSync( path, buffer );
    }
  }

  curryGetSQLTableExists(db:any):Function
  {
    return (tableID:String):Boolean =>
    {
        var sqlString = `SELECT name FROM sqlite_master WHERE type='table' AND name='${ tableID }' ;`;
        var result = this.db.exec( sqlString );

        return result.length > 0;
    }
  }

  curryInsert(db:any):Function
  {
    return (tableID:String, list:Object[]):void =>
    {
      var table = this.getDataTableFromObjectList( list );
      var tableExists = this.getSQLTableExists( tableID );
      var createTable = tableExists ? '' : this.getSQLStringCreateTable( tableID, table[ 0 ] );
      var insertListObjectData = this.getSQLStringInsertListObjectData( tableID, table );

      var sqlString = `${ createTable }\n${ insertListObjectData }`;
      db.run( sqlString );

      this.save();
    }
  }
}
