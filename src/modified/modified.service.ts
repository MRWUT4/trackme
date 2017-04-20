import { Injectable } from '@angular/core';
import { Modified } from './modified';
import { spawn } from 'child_process';
import { Filter, FilterElement } from '../filter/Filter';
import { LocalSQLite } from '../localsqlite/localsqlite';

@Injectable()
export class ModifiedService
{
	tableID:String = 'modified';
	localSQLite:LocalSQLite = new LocalSQLite( 'trackme' );

	filter:Filter = new Filter(
	[
		new FilterElement( 'nonApplicationSupport', list => list.filter( value => !value.match( '/Application Support' ) ) ),
		new FilterElement( 'nonLibrary', list => list.filter( value => !value.match( '/Library' ) ) ),
		new FilterElement( 'nonEmpty', list => list.filter( value => value != '' ) ),
		new FilterElement( 'nonFiles', list => list.filter( value => value.split( '/' ).pop().split( '.' ).length > 1 ) )
	]);


	getSQLStringSelectAllFromTable(tableID:String):String
	{
		return `SELECT * FROM ${ tableID };`
	}

	getSQLStringSelectDayFromTable(tableID:String, date:Date):String
	{
		var nextDay:Date = new Date( date.getTime() );
		nextDay.setDate( date.getDate() + 1 );

		return `SELECT * FROM ${ tableID } WHERE time > ${ date.getTime() } AND time < ${ nextDay.getTime() }`;
	}


	getModifiedList(): Promise<Modified[]>
	{
		return new Promise(resolve =>
		{
			var table:Modified[] = this.localSQLite.export( this.getSQLStringSelectDayFromTable( this.tableID, new Date( 2017, 3, 19 ) ) ).map( Modified );
			resolve( table[ 0 ] );

			this.receiveUsername( username =>
			{
				this.receiveLastModified( username, list =>
				{
					list = this.filter.apply( list );
					list = this.getModifiedWithDate( list );

					this.localSQLite.insert( this.tableID, list );
				});
			});
		});
	}

	getModifiedWithDate(list):Modified[]
	{
		var objects:Modified[] = list.map( (path) =>
		{
			var modified:Modified = new Modified();
			modified.path = path;
			modified.time = new Date().getTime();

			return modified;
		});

		return objects;
	}

	receiveLastModified(username, callback)
	{
		var folder = '/users/' + username;
		const find = spawn( 'find', [ folder, '-mmin', '1' ] );

		var findHandler = data =>
		{
			var string = data.toString();
			var list = string.split( '\n' );

			callback( list );

			find.stdout.removeListener( 'data', findHandler );
		}

		find.stdout.on( 'data', findHandler );
	}

	receiveUsername(callback)
	{
		const whoami = spawn( 'whoami' );

		whoami.stdout.on( 'data', data =>
		{
			var username = data.toString().replace( "\n", "" ).replace( " ", "" );
			callback( username );
		});
	}
}
