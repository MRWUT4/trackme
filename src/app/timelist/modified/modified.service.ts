import { Injectable } from '@angular/core';
import { Modified } from './modified';
import { spawn } from 'child_process';
import { Filter, FilterElement } from '../../shared/filter/Filter';
import { LocalSQLite, Column } from '../../shared/localsqlite/localsqlite';
import { Observable } from 'rxjs/Observable';

import * as os from 'os';

@Injectable()
export class ModifiedService
{
	static USERNAME:string;
	static MODIFIED_INTERVAL;

	tableID:String = 'modified';
	localSQLite:LocalSQLite = new LocalSQLite( 'trackme',
	[
		new Column( 'path', 'text' ),
		new Column( 'time', 'int'  )
	]);

	filter:Filter = new Filter(
	[
		new FilterElement( 'nonApplicationSupport', list => list.filter( value => !value.match( '/Application Support' ) ) ),
		new FilterElement( 'nonDSStore', list => list.filter( value => !value.match( '.DS_Store' ) ) ),
		new FilterElement( 'nonDSStore', list => list.filter( value => !value.match( '.bash_history' ) ) ),
		new FilterElement( 'nonDSStore', list => list.filter( value => !value.match( '.bash_sessions' ) ) ),
		new FilterElement( 'nonSQLite', list => list.filter( value => !value.match( '.sqlite' ) ) ),
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


	getModifiedList(date:Date = null):Observable<Modified[]>
	{
		date = date == null ?  new Date() : date;
		date = this.modDateToNull( date );

		return new Observable( observer =>
		{
				let answerWithTableData = () =>
				{
					var table:any[] = this.localSQLite.export( this.tableID, this.getSQLStringSelectDayFromTable( this.tableID, date ) ).map( Modified );
					observer.next( table[ 0 ] || [] );
				};

				let execute = () =>
				{
					answerWithTableData();
					this.insertModifiedPathsInLocalSQLDatabase();
				};

				this.startSaveModifiedLoop( execute );
				answerWithTableData();
		});
	}



	startSaveModifiedLoop(callback:Function):void
	{
		if( ModifiedService.MODIFIED_INTERVAL == undefined )
		{
			let everyMinute:number = 1000 * 60;

			ModifiedService.MODIFIED_INTERVAL = setInterval( callback, everyMinute );
			callback();
		}
	}

	insertModifiedPathsInLocalSQLDatabase():void
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
			list.pop();

			callback( list );

			find.stdout.removeListener( 'data', findHandler );
		}

		find.stdout.on( 'data', findHandler );
	}

	receiveUsername(callback)
	{
		if( ModifiedService.USERNAME )
			callback( ModifiedService.USERNAME );
		else
		{
			const whoami = spawn( 'whoami' );

			let string = '';

			whoami.stdout.on( 'data', data =>
			{
				string += data.toString();
			});

			whoami.on( 'close', code =>
			{
				var username = string.replace( "\n", "" ).replace( " ", "" );
				ModifiedService.USERNAME = username;

				callback( username );
			});
		}
	}
}
