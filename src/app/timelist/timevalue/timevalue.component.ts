import { Component, Input } from '@angular/core';

@Component(
{
	selector: 'timevalue',
	template: require( './timevalue.component.html' ),
	styles: [ require( './timevalue.component.css' ) ]
})
export class TimeValueComponent
{
	public folderDepth:number = 4;
	public distanceMultiplier:number = .5;

	@Input() time:String = '';
	@Input() path:String = './';
	@Input() distance:number = 0;


	get distanceEm():String
	{
		return Math.ceil( this.distance * this.distanceMultiplier) + 'em';
	}

	get folder():String
	{
		var split = this.path.split( '/' );
		var folders = split.slice( split.length - this.folderDepth, -1 ).join( ' / ' ) + ' / ';
		var prefix = '... ';

		return prefix + folders;
	}

	get file():String
	{
		return this.path.split( '/' ).pop();
	}

	constructor(){}
}
