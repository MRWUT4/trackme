import { Component, Input } from '@angular/core';

@Component(
{
	selector: 'timevalue',
	template: require( './timevalue.component.html' )
	// styleUrls: ['./app.component.css']
})
export class TimeValueComponent
{
	@Input() time:Number = 0;
	@Input() path:String = './';

	constructor(){}
}
