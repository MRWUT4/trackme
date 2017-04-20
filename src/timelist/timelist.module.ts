import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TimeListComponent } from './timelist.component';
import { TimeValueComponent } from '../timevalue/timevalue.component';
import { DatePickerComponent } from '../datepicker/datepicker.component';
// import { DatePipe } from '@angular/core';

@NgModule(
{
	imports:
	[
		BrowserModule
	],
	declarations:
	[
    TimeListComponent,
		TimeValueComponent,
		DatePickerComponent

		//pipes
		// DatePipe
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
