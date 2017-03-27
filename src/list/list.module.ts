import { NgModule } from '@angular/core';
import { ListComponent } from './list.component';

@NgModule(
{
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