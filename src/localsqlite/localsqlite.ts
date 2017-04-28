import * as fs from 'fs';
import { ValuePair } from './valuepair';

import { remote } from 'electron';
// import * as SQL from 'sql.js';
const SQL = require( 'sql.js' );

export class Column
{
  constructor(

    public name:string,
    public type:string,
    public primary:Boolean = false

  ){}
}



export class LocalSQLite
{
  private _db:any;

  private getSQLTableExists:Function;
  private save:Function;

  public insert:Function;
  public run:Function;
  public export:Function;
  public setup:Function;
  public createTableIfItDoesntExist:Function;


  /*
   * Getter / Setter
   */

  get path():string
  {
    // let string = './' + this.name + '.sqlite';

    // let appPath = remote.app.getAppPath();
    // let string = appPath.split( '/' ).slice( 0, -1 ).join( '/' ) + '/' + this.name + '.sqlite';

    let appData = remote.app.getPath( 'appData' );
    let string = `${ appData }/${ this.name }/Databases.sqlite`;

    return string;
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


  getSQLStringCreateTable(tableID:String, tableInterface:Column[]):String
  {
    var fields:String = '';

    tableInterface.forEach( (column, index) =>
    {
        var prefix = index == 0 ? '' : ', ';
        fields += prefix + column.name + ' ' + column.type;
    });


    var primaryList:String = this.getPrimaryList( tableInterface );
    var primary:String = primaryList != '' ? `, PRIMARY KEY( ${ primaryList } )` : '';
    var sqlString = `CREATE TABLE ${ tableID } ( ${ fields } ${ primary } );`;

    return sqlString;
  }

  getPrimaryList(tableInterface:Column[]):String
  {
    let result = [];

    tableInterface.forEach( column =>
    {
      if( column.primary )
        result.push( column.name );
    })

    return result.join( ',' );
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

  // sortByProperty(a:ValuePair, b:ValuePair):number
  // {
  //   var valueA = a.property.toUpperCase();
  //   var valueB = b.property.toUpperCase();
  //
  //   return valueA > valueB ? 1 : valueA < valueB ? -1 : 0 ;
  // }

  getDataTableFromObjectList(list:Object[], tableInteface:Column[]):Array<any>
  {
    var result = [];

    list.forEach( element =>
    {
      var pairs:ValuePair[] = [];

      tableInteface.forEach( column =>
      {
        var value = element[ column.name ];
        var pair = new ValuePair( column.name, value );

        pairs.push( pair );
      });

      // pairs = pairs.sort( this.sortByProperty );

      result.push( pairs );
    });

    return result;
  }


  /*
   * Public interface.
   */

  constructor(private name:String, private tableInterface:Column[])
  {
    var db = this.db;

    this.getSQLTableExists = this.curryGetSQLTableExists( db );
    this.setup = this.currySetup( db );
    this.save = this.currySave( db, this.path );
    this.insert = this.curryInsert( db, this.tableInterface );
    this.export = this.curryExport( db, this.tableInterface );
    this.run = this.curryRun( db, this.tableInterface );
    this.createTableIfItDoesntExist = this.curryCreateTableIfItDoesntExist( db );
  }


  curryExport(db:any, tableInterface:Column[])
  {
    return (tableID:String, sqlString:String) =>
    {
      this.createTableIfItDoesntExist( tableID, tableInterface );

      return {

        map: (templateConstuctor:any) =>
        {
          var result = [];
          var list = db.exec( sqlString );

          list.forEach( element =>
          {
            var queryList = [];
            result.push( queryList );

            var columns = element.columns;
            var values = element.values;

            values.forEach( value =>
            {
              var template = new templateConstuctor();
              queryList.push( template );

              columns.forEach( (column, index) =>
              {
                template[ column ] = value[ index ];
              });
            });
          });

          return result;
        }
      }
    }
  }

  curryRun(db:any, tableInteface:Column[]):Function
  {
    return (tableID:String, sqlString:String) =>
    {
      this.createTableIfItDoesntExist( tableID, tableInteface );

      db.run( sqlString );
      this.save();
    }
  }

  currySetup(db:any):Function
  {
    return (tableID:String, list:Object[]):void =>
    {
      var tableExists = this.getSQLTableExists( tableID );
    }
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
        var result = db.exec( sqlString );

        return result.length > 0;
    }
  }

  curryInsert(db:any, tableInteface:Column[]):Function
  {
    return (tableID:String, list:Object[]):void =>
    {
      this.createTableIfItDoesntExist( tableID, tableInteface );

      var table = this.getDataTableFromObjectList( list, tableInteface );
      var insertListObjectData = this.getSQLStringInsertListObjectData( tableID, table );

      var sqlString = `${ insertListObjectData }`;

      db.run( sqlString );
      this.save();
    }
  }

  curryCreateTableIfItDoesntExist(db:any):Function
  {
    return (tableID:String, tableInterface:Column[]) =>
    {
      var tableExists = this.getSQLTableExists( tableID );
      var createTable = tableExists ? '' : this.getSQLStringCreateTable( tableID , tableInterface );

      var sqlString = `${ createTable }`;
      db.run( sqlString );

      this.save();
    }
  }
}
