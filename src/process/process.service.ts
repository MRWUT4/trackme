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

			setTimeout( () =>
			{
			that.receiveUsername( username =>
			{
				that.receivePSAux( processes =>
				{
					that.receiveFormatedUserProcessColums( processes, list =>
					{
						// console.log( processes );
						// console.log( '\n\n' );


						// console.log( "start", list.length );

						list = this.filterObjectProperty( list, 'user', user => user == username );
						// list = this.filterObjectProperty( list, 'stat', stat => stat == "R" );
						list = this.filterObjectProperty( list, 'stat', stat => stat.match( 'R' ) );

						// console.log( "filtered", list.length );
						
						// if( list.length == 0 )
						// 	console.log( list );
						// list = this.filterObjectProperty( list, "pid", undefined, false );
						// list = this.filterObjectProperty( list, "command", "/System", false );
						// list = this.filterObjectProperty( list, "command", "/usr/", false );
						// var onlyStatR = this.filterObjectProperty( noUSRCommand, "stat", "R" );
						// var noUs = this.filterObjectProperty( list, "command", "/System", false );
						// userProcesses.forEach( element => console.log( element ) );

						//*
						list.forEach( element => console.log( element.command ) );
						/*/
						that.addOpenFilesToUserProcesses( list );
						//*/
					});
				});
			});
			}, 0 )

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
				var formatted = that.receiveFormatedUserProcessColums( string, list =>
				{
					list = that.filterObjectProperty( list, 'type', type => type == "DIR" );
					// var onlyUserDirectory = that.filterObjectProperty( list, 'name', name => name.match( '/Users/' ) );
					// list = that.filterObjectProperty( list, 'name', name => 
					// { 
					// 	var substring = name.split( '/' ).pop();

					// 	// console.log( substring );

					// 	return substring.match( '\\....' );
					// });

					list.forEach( element => console.log( '\t', element ) );
					// result.forEach( element => console.log( element ) );
					// console.log(  );
				});
			});
		});
	}



	/** Receive bash output and format its columns to objects. */
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