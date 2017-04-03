import { Injectable } from '@angular/core';

import { Process } from './process';
import { PROCESSES } from './mock-process';


const spawn:any = eval( 'require("child_process").spawn' );


@Injectable()
export class ProcessService 
{
// const exec: any = eval( 'require("child_process").exec' );

// var string = exec( "ls" );

// console.log( string );

	// static get spawn()
	// {
	// 	return require( 'child_process' ).spawn;
	// }

	// static get app()
	// {
	// 	return require('electron').app;
	// }


	getProcesses(): Promise<Process[]>
	{
		// return Promise.resolve( PROCESSES );

		return new Promise(resolve => 
		{	
			var that = this;

			that.receiveUsername( (username) =>
			{
				console.log( "receiveUsername");

				that.receivePSAwk( (processes) =>
				{
					var userProcesses = that.getUserProcessesAsObjects( username, processes );
					that.addOpenFilesToUserProcesses( userProcesses );
					// console.log( userProcesses );
				});
			});

			// this.execute( 
			// [
			// 	this.receiveUsername,
			// 	this.receivePSAwk
			// ], 
			// values =>
			// {
			// 	var result = that.getUserProcessesAsObjects( values[ 0 ], values[ 1 ] );

			// 	result.forEach( element => console.log( element ) );

			// 	resolve( result );
			// 	// Application.app.quit();
			// });


			// Simulate server latency with 2 second delay
			// setTimeout( () => 
			// {
			// 	resolve( PROCESSES ), 200 
			// });
	    });
	}


	addOpenFilesToUserProcesses(userProcesses)
	{
		// console.log( "\n\n addOpenFilesToUserProcesses" );

		// var result = userProcesses.map( (userProcesses) => 
		// {
			var lsof = spawn( 'lsof', [ '-p', userProcesses[ 0 ].pid ] );

			lsof.stdout.on( 'data', data =>
			{
				// echo "a b c d" | awk --field-separator=" " "{ print NF }"
				console.log( data.toString() );
			});
		// });
	}

	// execute(list, callback)
	// {
	// 	var copy = list.concat();
	// 	var values = [];

	// 	var run = () =>
	// 	{
	// 		if( copy.length > 0 )
	// 		{
	// 			var method = copy.shift();

	// 			method( result =>
	// 			{
	// 				values.push( result );
	// 				run();
	// 			});
	// 		}
	// 		else
	// 			callback( values );
	// 	};

	// 	run();
	// }	


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

	receivePSAwk(callback)
	{	
		var result = '';

		// const spawn = Application.spawn;
		const ps = spawn( 'ps', [ 'aux' ] );

		const awk = spawn( 'awk', 
		[ 
			'{ \
				print \
				"user:" $1 ";" \
				"pid:" $2 ";" \
				"cpu:" $3 ";" \
				"mem:" $4 ";" \
				"vsz:" $5 ";" \
				"rss:" $6 ";" \
				"stat:" $8 ";" \
				"started:" $9 ";" \
				"time:" $10 ";" \
				"command:" $11 \
			}'

		], { stdio: [ ps.stdout ] } );


		awk.stdout.on( 'data', data =>
		{
			result += data.toString();
		});

		awk.on( 'close', data =>
		{
			// console.log( 'END', data );
			callback( result );
		});
	}


	getUserProcessesAsObjects(username, string)
	{
		var lines = this.splitNewLine( string );
		var columns = this.mapColumns( lines, ";" );
		var data = this.mapData( columns );
		var users = this.filterObjectProperty( data, "user", username );

		// console.log( users );
		return users;
	}

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