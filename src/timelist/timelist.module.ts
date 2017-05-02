import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeListComponent } from './timelist.component';
import { TimeValueComponent } from '../timevalue/timevalue.component';
import { DatePickerComponent } from '../datepicker/datepicker.component';
import { SuffixPickerComponent } from '../suffixpicker/suffixpicker.component';
import { ReplaceNullPipe } from '../pipes/replacenull.pipe';
import { NumberToTextPipe } from '../pipes/numbertotext.pipe';
import { CircleDiagramDay } from '../circlediagramday/circlediagramday.component';
import { ProgressTextComponent } from '../progresstext/progresstext.component';

@NgModule(
{
	declarations:
	[
		DatePickerComponent,
		SuffixPickerComponent,
		TimeListComponent,
		TimeValueComponent,
		ReplaceNullPipe,
		NumberToTextPipe,
		CircleDiagramDay,
		ProgressTextComponent
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
