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

	@Input() time:String = '';
	@Input() path:String = './';
	@Input() distance:Number = 0;


	get distanceEm():String
	{
		return this.distance + 'em';
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
