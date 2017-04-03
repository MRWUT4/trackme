import { Injectable } from '@angular/core';

import { Process } from './process';
import { PROCESSES } from './mock-process';


const spawn:any = eval( 'require("child_process").spawn' );


@Injectable()
export class ProcessService 
{
	getProcesses(): Promise<Process[]>
	{
		return new Promise(resolve => 
		{	
			var that = this;

			that.receiveUsername( username =>
			{
				that.receivePSAux( processes =>
				{
					that.receiveFormatedUserProcessColums( processes, list =>
					{
						var userProcesses = this.filterObjectProperty( list, "user", username );
						that.addOpenFilesToUserProcesses( userProcesses );
					});
				});
			});

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
			var string = '';
			var lsof = spawn( 'lsof', [ '-p', userProcess.pid ] );


			lsof.stdout.on( 'data', data =>
			{
				string += data.toString();
			});

			lsof.on( 'close', event =>
			{
				var formatted = that.receiveFormatedUserProcessColums( string, result =>
				{
					result.forEach( element => console.log( element ) );
					// console.log( that.filterObjectProperty( result, "type", "DIR" ) );
				});
			});
		});

	}

	receiveFormatedUserProcessColums(input, callback)
	{
		const that = this;
		const awkNumColumns = spawn( 'awk', [  '--field-seperator=" "', '{ print NF }' ] );

		var string = '';

		awkNumColumns.stdout.on( 'data', data =>
		{
			string += data.toString();
		});

		awkNumColumns.on( 'close', event =>
		{
			var numLines = Number( string );

			that.receiveColumnsOfString( input, numLines, result => 
			{
				var list = that.getFormatedObjectList( result );
				callback( list );
			});
		});

		var firstLine = input.split( "\n" )[ 0 ];
		awkNumColumns.stdin.write( firstLine );
		awkNumColumns.stdin.end();
	}

	getFormatedObjectList(list)
	{
		var result = [];
		var length = list[ 0 ].length;

		for( var i = 1; i < length - 1; i++ )
		{
			var object = {};

			for( var j = 1; j < list.length; j++ )
			{
				var column = list[ j ];

				var property = column[ 0 ].toLowerCase();
				var value = column[ i ];

				object[ property ] = value;
			}

			result.push( object );
		}

		return result;
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

				if( awkColumnAtIndex.stdout )
				{
					awkColumnAtIndex.stdout.on( 'data', data =>
					{
						string += data.toString();
					});

					awkColumnAtIndex.on( 'close', () =>
					{
						result.push( string.split( "\n" ) );

						if( result.length >= num )
							callback( result );
					})

					awkColumnAtIndex.stdin.write( input );
					awkColumnAtIndex.stdin.end();
				}
			}
			
			parse( i );
		}
	}


	receiveUsername(callback)
	{
		// const spawn = Application.spawn;
		const whoami = spawn( "whoami" );

		whoami.stdout.on( "data", data =>
		{
			var username = data.toString().replace( "\n", "" ).replace( " ", "" );
			console.log( username );
			callback( username );
		});
	}

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


	// receiveUserProcessesAsObjects(username, string, callback)
	// {
	// 	this.receiveFormatedUserProcessColums( string, list =>
	// 	{
	// 		var userList = this.filterObjectProperty( list, "user", username );
	// 		callback( userList );
	// 	});
	// }

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

	filterObjectProperty(list, property, value)
	{
		return list.filter( element =>
		{
			return element[ property ] == value;
		});
	}
}