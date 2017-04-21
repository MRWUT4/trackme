import { Component, OnInit, NgZone } from '@angular/core';
import { Modified } from '../modified/modified';
import { ModifiedService } from '../modified/modified.service';

@Component(
{
	selector: 'timelist',
	template: require( './timelist.component.html' ),
	styles: [ require( './timelist.component.css' ) ],
	providers: [ ModifiedService ]
})
export class TimeListComponent implements OnInit
{
	public date:Date = new Date();
	// foo:Number = 20;

	previousTime:String = null;
	modifieds: Modified[];


	getTimeValue(value:number):String
	{
		var minutes = Math.floor( value / 1000 / 60 );
		var stringValue = String( minutes );

		if( this.previousTime == null || this.previousTime != stringValue )
		{
			this.previousTime = stringValue;
			return String( value );
		}
		else
			return '';
	}


	constructor(private ngZone:NgZone, private modifiedService:ModifiedService){}

	ngOnInit():void
	{
			this.getModifiedList();
	}

	getModifiedList(date:Date = null, insertOpenFiles:Boolean = true):void
	{
		this.modifieds = [];

		this.modifiedService.getModifiedList( date, insertOpenFiles ).then( modifieds =>
		{
			this.modifieds = modifieds;
			console.log( "update" );
			this.ngZone.run( () => {} ); // <- Electron template update fix.
		});
	}


	onDateChange(date:Date):void
	{
		this.getModifiedList( date, false );
	}
}
