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
				that.receiveLSOF( string =>
				{
					that.receiveFormatedUserProcessColums( string, list =>
					{
						list = this.filterObjectProperty( list, "name", "Adobe" );

						list.forEach( element => console.log( element.name ) );
					});
				});

				// that.receivePSAux( processes =>
				// {
				// 	that.receiveFormatedUserProcessColums( processes, list =>
				// 	{
				// 		var userProcesses = this.filterObjectProperty( list, "user", username );
				// 		var noSystemCommands = this.filterObjectProperty( userProcesses, "command", "/System", false );
				// 		var noUSRCommand = this.filterObjectProperty( noSystemCommands, "command", "/usr/", false );
				// 		// var onlyStatR = this.filterObjectProperty( noUSRCommand, "stat", "R" );
				// 		// var noUs = this.filterObjectProperty( list, "command", "/System", false );
				// 		// userProcesses.forEach( element => console.log( element ) );
				// 		that.addOpenFilesToUserProcesses( noUSRCommand );
				// 	});
				// });
			});

			// Simulate server latency with 2 second delay
			// setTimeout( () => 
			// {
			// 	resolve( PROCESSES ), 200 
			// });
	    });
	}


	// addOpenFilesToUserProcesses(userProcesses)
	// {
	// 	const that = this;

	// 	userProcesses.shift();

	// 	userProcesses.forEach( userProcess =>
	// 	{
	// 		console.log( userProcess );

	// 		if( userProcess.pid )
	// 		{
	// 			var string = '';
	// 			var lsof = spawn( 'lsof', [ userProcess.pid ] );

	// 			lsof.stdout.on( 'data', data =>
	// 			{
	// 				string += data.toString();
	// 			});

	// 			lsof.on( 'close', event =>
	// 			{
	// 				var formatted = that.receiveFormatedUserProcessColums( string, list =>
	// 				{
	// 					var onlyTypeDIR = that.filterObjectProperty( list, "type", "DIR" )

	// 					onlyTypeDIR.forEach( element => console.log( element ) );
	// 					// result.forEach( element => console.log( element ) );
	// 					// console.log(  );
	// 				});
	// 			});
	// 		}
	// 	});

	// }



	/** Receive bash output and format its columns to objects. */
	receiveFormatedUserProcessColums(input, callback)
	{
		const awkNumColumns = spawn( 'awk', [  '--field-seperator=" "', '{ print NF }' ] );

		// if( awkNumColumns.stdout )
		// {
			const that = this;
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
		// }
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

				// if( awkColumnAtIndex.stdout )
				// {
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
				// }
			}
			
			parse( i );
		}
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


	/** Receive current system username. */
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
		const ps = spawn( 'lsof' );

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

	filterObjectProperty(list, property, value, bool = true)
	{
		return list.filter( element =>
		{
			return ( element[ property ] && element[ property ].match( value ) != null ) == bool;
		});
	}
}