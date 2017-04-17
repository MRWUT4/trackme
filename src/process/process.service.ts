import { Injectable } from '@angular/core';

import { Process } from './process';
import { PROCESSES } from './mock-process';


const spawn:any = eval( 'require("child_process").spawn' );


@Injectable()
export class ProcessService 
{
	filterDocumentTypes:Function = this.curryFilterDocumentTypes( [ 'js', 'fla', 'ts', 'html' ] );

	getProcesses(): Promise<Process[]>
	{
		return new Promise(resolve => 
		{	
			var that = this;

			var execute = () =>
			{
				that.receiveUsername( username =>
				{
					that.receiveLastModifiedFiles( username, list =>
					{
						list.forEach( element => console.log( element ) );
					});

					// that.receivePSAux( processes =>
					// {
					// 	that.receiveFormatedUserProcessColums( processes, list =>
					// 	{
					// 		// console.log( processes );
					// 		// console.log( '\n\n' );

					// 		// find /users -mtime -1

					// 		// console.log( "start", list.length );

							

					// 		var userServices = this.filterObjectProperty( list, 'user', user => user == username );
					// 		// list = this.filterObjectProperty( list, 'stat', stat => stat != 'Ss' );
					// 		// list = this.filterObjectProperty( list, 'stat', stat => stat != 'SNs' );
					// 		// list = this.filterObjectProperty( list, 'stat', stat => stat != 'Z' );
					// 		// list = this.filterObjectProperty( list, 'stat', stat => stat != 'S' );
					// 		var runningServices = this.filterObjectProperty( userServices, 'stat', stat => stat.match( 'R' ) );



					// 		var activeServices = this.filterActiveServices( userServices, runningServices );

					// 		activeServices.forEach( activeService => console.log( activeService.command ) );

					// 		// activeServices.forEach( service => console.log( service.command ) );

					// 		// console.log( "filtered", list.length );
							
					// 		// if( list.length == 0 )

					// 		// 	console.log( list );
					// 		// list = this.filterObjectProperty( list, "pid", undefined, false );
					// 		// list = this.filterObjectProperty( list, "command", "/System", false );
					// 		// list = this.filterObjectProperty( list, "command", "/usr/", false );
					// 		// var onlyStatR = this.filterObjectProperty( noUSRCommand, "stat", "R" );
					// 		// var noUs = this.filterObjectProperty( list, "command", "/System", false );
					// 		// userProcesses.forEach( element => console.log( element ) );

					// 		//*
					// 		activeServices.forEach( process =>
					// 		{
					// 			// that.receiveApplicationNameFromPID( process.pid, result =>
					// 			// {
					// 			// 	console.log( result );
					// 			// });

					// 			that.receiveOpenFilesFromPID( process.pid, username, list =>
					// 			{
					// 				// console.log( '\n', list.length );
					// 				list.forEach( element =>
					// 				{
					// 					list.forEach( element => console.log( '\t', element.name ) );
					// 				});
					// 			});
					// 		});

					// 		/*/
					// 		that.addOpenFilesToUserProcesses( list );
					// 		//*/
					// 	});
					// });
				});
			}

			setInterval( () =>
			{
				execute();

			}, 60000 );

			execute();


			

			// Simulate server latency with 2 second delay
			// setTimeout( () => 
			// {
			// 	resolve( PROCESSES ), 200 
			// });
	    });
	}

	addOpenFilesToUserProcesses(userProcesses)
	{
		const that = this;

		userProcesses.shift();

		userProcesses.forEach( userProcess =>
		{
	
		});
	}

	curryFilterDocumentTypes(list)
	{
		return string =>
		{
			var name = string.split( '/' ).pop();

			for( var i = 0; i < list.length; i++ )
			{
				var type = "\\." + list[ i ];

				if( name.match( type ) )
					return true;
			}

			return false;
		}
	}


	filterActiveServices(userServices, runningServices)
	{
		var that = this;
		var result = [];

		runningServices.forEach( service =>
		{
			var name = service.command.split( '/' ).pop();
			var list = that.filterObjectProperty( userServices, 'command', command => command.match( name ) );

			result = result.concat( list );
		});

		return result;
	}

	/** Receive bash output and format its columns to objects. */
	receiveLastModifiedFiles(username, callback)
	{
		// find /users/david.ochmann -mtime -1m
		var userdir = '/users/' + username;
		const find = spawn( 'find', [ userdir, '-mtime', '-1m' ] );
		
		var findListener = data =>
		{
			var string = data.toString();
			find.stdout.removeListener( 'data', findListener );

			callback( string.split( '\n' ) );
		}

		find.stdout.on( 'data', findListener );
	}

	receiveApplicationNameFromPID(pid, callback)
	{
		const psPOComm = spawn( 'ps', [  '-p', String( pid ), '-o comm' ] );

		var string = '';

		psPOComm.stdout.on( 'data', data =>
		{
			string += data.toString();
		});

		psPOComm.on( 'close', event =>
		{
			callback( string.split( '\n' )[ 1 ] );
		});
	}

	receiveOpenFilesFromPID(pid, username, callback)
	{
		var that = this;
		var string = '';
		var lsof = spawn( 'lsof', [ '-p', pid ] );

		lsof.stdout.on( 'data', data =>
		{
			string += data.toString();
		});

		lsof.on( 'close', event =>
		{
			// console.log( string );
			var formatted = that.receiveFormatedUserProcessColums( string, list =>
			{
			// 	list = that.filterObjectProperty( list, 'fd', fd => fd != 'txt' );
			// 	list = that.filterObjectProperty( list, 'fd', fd => fd != 'txt' );
			// 	list = that.filterObjectProperty( list, 'fd', fd => fd != 'cwd' );
				// list = that.filterObjectProperty( list, 'type', type => type == 'DIR' );
				// list = that.filterObjectProperty( list, 'type', type => type != 'CHR' );
				// list = that.filterObjectProperty( list, 'type', type => type != 'PIPE' );
				list = that.filterObjectProperty( list, 'name', that.filterDocumentTypes )

				// list = that.filterObjectProperty( list, 'name', name => name.match( username ) );
				// list = that.filterObjectProperty( list, 'name', name => name.match( '\\.OTF' ) == null );
				// list = that.filterObjectProperty( list, 'name', name => name.match( '\\.otf' ) == null );
				// list = that.filterObjectProperty( list, 'name', name => name.match( '\\.TTF' ) == null );
				// list = that.filterObjectProperty( list, 'name', name => name.match( '\\.ttf' ) == null );
				// list = that.filterObjectProperty( list, 'name', name => name.match( '\\.ttc' ) == null );
				// list = that.filterObjectProperty( list, 'name', name => name.match( '/System/' ) == null );
				// list = that.filterObjectProperty( list, 'name', name => name.match( '/Library/' ) == null );
				// list = that.filterObjectProperty( list, 'name', name => name.match( '/usr/' ) == null );
				// list = that.filterObjectProperty( list, 'name', name => name.match( '/private/' ) == null );
				// list = that.filterObjectProperty( list, 'name', name => name.split( '/' ).pop().split( '.' ).length > 1 );

				// list = that.filterObjectProperty( list, 'fd', fd => fd == 'txt' );

				callback( list );
			});
		});
	}


	receiveFormatedUserProcessColums(input, callback)
	{
		const awkNumColumns = spawn( 'awk', [  '--field-seperator=" "', '{ print NF }' ] );

		const that = this;
		var string = '';

		awkNumColumns.stdout.on( 'data', data =>
		{
			string += data.toString();
		});

		awkNumColumns.on( 'close', event =>
		{
			var numLines = string.split( '\n' ).reduce( (result, element) =>
			{	
				var value = Number( element );
				return value > result ? value : result;

			}, 0 );

			that.receiveColumnsOfString( input, numLines, result => 
			{
				var list = that.getFormatedObjectList( result );
				callback( list );
			});
		});

		awkNumColumns.stdin.write( input );
		awkNumColumns.stdin.end();
	}

	receiveColumnsOfString(input, num, callback)
	{
		var result = [];

		for( var i = 0; i < num; i++ )
		{
			var parse = (index) =>
			{
				var awkColumnAtIndex = spawn( 'awk', [ '{ print $' + String( index + 1 ) + ' }' ] );
				var string = '';

				awkColumnAtIndex.stdout.on( 'data', data =>
				{
					string += data.toString();
				});

				awkColumnAtIndex.on( 'close', () =>
				{
					result.push( string.split( '\n' ) );

					if( result.length >= num )
						callback( result );
				});

				awkColumnAtIndex.stdin.write( input );
				awkColumnAtIndex.stdin.end();
			}
			
			parse( i );
		}
	}

	getFormatedObjectList(list)
	{
		var result = [];
		var length = list[ 0 ].length;

		for( var y = 1; y < length; y++ )
		{
			var object = {};

			for( var x = 0; x < list.length; x++ )
			{
				var column = list[ x ];

				var property = column[ 0 ].toLowerCase();
				var value = column[ y ];

				if( property && value )
					object[ property ] = value;
			}

			result.push( object );
		}

		return result;
	}


	/** Receive current system username. */
	receiveUsername(callback)
	{
		// const spawn = Application.spawn;
		const whoami = spawn( 'whoami' );

		whoami.stdout.on( 'data', data =>
		{
			var username = data.toString().replace( "\n", "" ).replace( " ", "" );
			callback( username );
		});
	}


	// receiveTop(callback)
	// {
	// 	const top = spawn( 'top'/*, [ '-l 0' ]*/ );
		
	// 	// top.stdout.pipe(process.stdout);

	// 	const dataListener = data =>
	// 	{
	// 		console.log( data.toString() );
	// 		top.stdout.removeListener( 'data', dataListener );
	// 	}

	// 	top.stdout.on('data', dataListener );

	// }


	/** Receive current active processes. */
	receivePSAux(callback)
	{	
		var string = '';

		const that = this;
		const ps = spawn( 'ps', [ 'aux' ] );

		ps.stdout.on( 'data', data =>
		{
			string += data.toString();
		});

		ps.on( 'close', data =>
		{
			callback( string );
		});
	}


	/** Receive List of open files. */
	receiveLSOF(callback)
	{
		var string = '';

		const that = this;
		const ps = spawn( 'lsof', [ '-v' ] );

		ps.stdout.on( 'data', data =>
		{
			string += data.toString();
		});

		ps.on( 'close', data =>
		{
			callback( string );
		});
	}


	/** Data formatting functions. */
	splitNewLine(string)
	{
		return string.split( "\n" );
	}

	mapColumns(list, delimiter)
	{
		return list.map( element =>
		{
			return element.split( delimiter );
		});
	}

	mapData(list, delimiter = ":")
	{
		return list.map( element0 =>
		{
			var result = {};

			element0.forEach( element1 =>
			{
				var split = element1.split( delimiter );
				var property = split.shift();
				var value = split.join( delimiter );

				result[ property ] = value;
			});

			return result;
		});
	}

	// filterObjectProperty(list, property, value, bool = true)
	filterObjectProperty(list, property, filter)
	{
		return list.filter( element =>
		{
			return element[ property ] != undefined ? filter( element[ property ] ) : false;
			// return ( element[ property ] && element[ property ].match( value ) != null ) == bool;
		});
	}
}