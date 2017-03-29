import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { ListComponent } from './list.component';

@NgModule(
{
	imports:
	[
		BrowserModule
	],
	declarations: 
	[
		ListComponent
	],
	exports: 
	[ 
		ListComponent 
	]
})
export class ListModule
{
	constructor()
	{
		console.log( 'ListModule constructor' );
	}
}