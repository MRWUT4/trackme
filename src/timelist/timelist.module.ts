import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { TimeListComponent } from './timelist.component';
import { TimeValueComponent } from '../timevalue/timevalue.component';

@NgModule(
{
	imports:
	[
		BrowserModule
	],
	declarations:
	[
    TimeListComponent,
		TimeValueComponent
	],
	exports:
	[
		TimeListComponent
	]
})
export class TimeListModule
{
	constructor(){}
}
