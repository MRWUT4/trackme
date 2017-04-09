import { Injectable } from '@angular/core';

import { Modified } from './modified';
// import { PROCESSES } from './mock-process';


const spawn:any = eval( 'require("child_process").spawn' );


@Injectable()
export class ModifiedService 
{
	filterNonApplicationSupport:Function = list => list.filter( value => !value.match( '/Application Support' ) );
	filterNonLibrary:Function = list => list.filter( value => !value.match( '/Library' ) );
	filterNonEmpty:Function = list => list.filter( value => value != '' );


	getModifiedList(): Promise<Modified[]>
	{
		return new Promise(resolve => 
		{	
			this.receiveUsername( username =>
			{
				this.receiveLastModified( username, list =>
				{
					list = this.filterNonApplicationSupport( list );
					list = this.filterNonLibrary( list );
					list = this.filterNonEmpty( list );

					console.log( list );

					list = this.getObjects( list );

					list.forEach( element => console.log( element ) );

					resolve( list );
				});
			});
	    });
	}

	getObjects(list):Modified[]
	{
		// return null;
		var objects:Modified[] = list.map( (path) =>
		{
			var modified:Modified = new Modified();
			modified.path = path;
			modified.date = new Date();

			return modified;
		});

		console.log( objects );

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
