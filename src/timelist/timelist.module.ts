import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeListComponent } from './timelist.component';
import { TimeValueComponent } from '../timevalue/timevalue.component';
import { DatePickerComponent } from '../datepicker/datepicker.component';
import { SuffixPickerComponent } from '../suffixpicker/suffixpicker.component';

@NgModule(
{
	declarations:
	[
		DatePickerComponent,
		SuffixPickerComponent,
		TimeListComponent,
		TimeValueComponent
	],
	imports:
	[
		BrowserModule,
		HttpModule,
		FormsModule
	],
	exports:
	[
		TimeListComponent
	],
	providers: [],
})
export class TimeListModule{}
