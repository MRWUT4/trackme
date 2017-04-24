import { Injectable } from '@angular/core';
import { LocalSQLite, Column } from '../localsqlite/localsqlite';
import { Selection } from './selection';

@Injectable()
export class SuffixSelectionService
{
  tableID:String = 'suffixSelection';
  localSQLite:LocalSQLite = new LocalSQLite( 'trackme', [ new Column( 'suffix', 'text' ) ] );


  getSQLStringSelectAllFromTable(tableID:String):String
	{
		return `SELECT * FROM ${ tableID };`
	}


  getSelectionList():Promise<Selection[]>
  {
    return new Promise( resolve =>
		{
      var table:any[] = this.localSQLite.export( this.tableID, this.getSQLStringSelectAllFromTable( this.tableID ) ).map( Selection );

      console.log( table );

			resolve( table[ 0 ] || [] );
		});
  }

  setSelectionList(selections:Selection[])
  {
    
  }
}
