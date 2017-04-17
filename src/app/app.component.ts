import { Component } from '@angular/core';
// import { bootstrap } from '@angular/platform-browser-dynamic';

@Component(
{
	selector: 'app',
	template: require( './app.component.html' ),
	// styleUrls: ['./app.component.css']
})
export class AppComponent 
{
	title = 'trackme';

	// constructor()
	// {
	// 	console.log( "DEBUG");
	// }
}

// bootstrap( AppComponent );


/*import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { spawn } from 'child_process';

console.log( spawn );

@Component(
{
  selector: 'app',
  template: require('./app.html'),
  styles: [], 
  providers: [],
  directives: []
})
export class App
{
}

bootstrap( App );
*/