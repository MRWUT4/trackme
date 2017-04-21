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
		new FilterElement( 'nonDSStore', list => list.filter( value => !value.match( '.DS_Store' ) ) ),
		new FilterElement( 'nonLibrary', list => list.filter( value => !value.match( '/Library' ) ) ),
		new FilterElement( 'nonEmpty', list => list.filter( value => value != '' ) ),
		new FilterElement( 'nonFiles', list => list.filter( value => value.split( '/' ).pop().split( '.' ).length > 1 ) )
	]);


	modDateToNull(date:Date):Date
	{
		date.setHours( 0 );
		date.setMinutes( 0 );
		date.setSeconds( 0 );

		return date;
	}


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


	getModifiedList(date:Date = null, insertOpenFiles:Boolean = true): Promise<Modified[]>
	{
		date = date == null ?  new Date() : date;
		date = this.modDateToNull( date );

		return new Promise( resolve =>
		{
			var table:any[] = this.localSQLite.export( this.getSQLStringSelectDayFromTable( this.tableID, date ) ).map( Modified );
			resolve( table[ 0 ] || [] );

			// var list = [ new Modified( new Date().getTime(), String( Math.random() * 10000 ) ) ];
			// resolve( list );

			// console.log( table[ 0 ] );

			if( insertOpenFiles )
			{
				this.receiveUsername( username =>
				{
					this.receiveLastModified( username, list =>
					{
						list = this.filter.apply( list );
						list = this.getModifiedWithDate( list );

						this.localSQLite.insert( this.tableID, list );
					});
				});
			}
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
