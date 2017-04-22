import { Component, Input } from '@angular/core';

@Component(
{
	selector: 'timevalue',
	template: require( './timevalue.component.html' ),
	styles: [ require( './timevalue.component.css' ) ]
})
export class TimeValueComponent
{
	@Input() time:String = '';
	@Input() path:String = './';

	constructor(){}
}
