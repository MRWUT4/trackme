import { Component } from '@angular/core';

@Component(
{
	selector: 'menu-bar',
	template: require( './menubar.component.html' ),
	styles: [ require( './menubar.component.css' ) ]
})
export class MenuBarComponent
{
	title = 'trackme';
}
