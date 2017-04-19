// import * as SQL from 'sql.js';
let SQL = require( 'sql.js' );

import * as fs from 'fs';


export class ValuePair
{
  private _value:any;

  get value():any
  {
    var result = this._value;
    result = typeof result == 'string' ? '\'' + result + '\'' : result;

    return result;
  }

  set value(value:any)
  {
    this._value = value;
  }


  constructor(public property:String, value:any)
  {
    this.value = value;
  }


  toString():String
  {
    return this.property + ' ' + this.value;
  }
}


export class LocalSQLite
{
  private _db:any;

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

  constructor(private name:String){}


  save():void
  {
    var data = this.db.export();
    var buffer = new Buffer( data );

    fs.writeFileSync( this.path, buffer );
  }

  insert(tableID:String, list:Object[])
  {
    var table = this.getDataTableFromObjectList( list );

    var createTable = this.getSQLStringCreateTable( tableID, table[ 0 ] );
    var insertListObjectData = this.getSQLStringInsertListObjectData( tableID, table );

    var sqlString = `${ createTable }\n${ insertListObjectData }`;

    console.log( sqlString );

    this.db.run( sqlString );
    this.save();
  }
}
