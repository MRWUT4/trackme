import { Injectable } from '@angular/core';
import { LocalSQLite, Column } from '../../shared/localsqlite/localsqlite';
import { Selection } from './selection';

@Injectable()
export class SuffixSelectionService
{
  tableID:String = 'suffix';
  localSQLite:LocalSQLite = new LocalSQLite( 'trackme',
  [
    new Column( 'value', 'text', true ),
    new Column( 'active', 'boolean' ),
  ] );


  getSQLStringSelectAllFromTable(tableID:String):String
	{
		return `SELECT * FROM ${ tableID };`
	}

  getSQLStringInserOrReplace(tableID:String, selections:Selection[]):String
  {
    let sqlString = '';

    selections.forEach( selection =>
    {
      let value:String = selection.value;
      sqlString += `INSERT OR REPLACE INTO ${ tableID } (value, active) `;
      sqlString += `VALUES ( '${ value }', ${ selection.active } );`
    });

    return sqlString;
  }


  getSelectionList():Promise<Selection[]>
  {
    return new Promise( resolve =>
		{
      var table:any[] = this.localSQLite.export( this.tableID, this.getSQLStringSelectAllFromTable( this.tableID ) ).map( Selection );
			resolve( table[ 0 ] || [] );
		});
  }

  setSelectionList(selections:Selection[])
  {
    this.localSQLite.run( this.tableID, this.getSQLStringInserOrReplace( this.tableID, selections ) );
    // this.localSQLite.insert( this.tableID, selections );
  }
}
