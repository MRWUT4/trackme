import { Component, OnInit } from '@angular/core';
import { CurrentVersionService } from '../currentversion/currentversion.service';

@Component(
{
	selector: 'app',
	template: require( './app.component.html' ),
	providers: [ CurrentVersionService ]
})
export class AppComponent implements OnInit
{
	title = 'trackme';

	constructor(private currentVersionService:CurrentVersionService){}

	ngOnInit()
	{
		console.log( 'ngOnInit' );
		this.getCurrentVersion();
	}

	getCurrentVersion():void
	{
		this.currentVersionService.getCurrentVersion().then( currentVersion =>
		{
				console.log( currentVersion )
		});
	}
}
