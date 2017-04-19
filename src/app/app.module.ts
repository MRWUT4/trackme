import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';

import { TimeListModule } from '../timelist/timelist.module';
import { AppComponent } from './app.component';

@NgModule(
{
	declarations:
	[
		AppComponent
	],
	imports:
	[
		BrowserModule,
		TimeListModule
		// FormsModule,
		// HttpModule
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule{}
