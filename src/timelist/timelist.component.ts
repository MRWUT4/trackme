import { Component, OnInit } from '@angular/core';
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


	constructor(private modifiedService:ModifiedService){}

	ngOnInit():void
	{
		this.getModifiedList();
	}

	getModifiedList(date:Date = null, insertOpenFiles:Boolean = true):void
	{
		this.modifiedService.getModifiedList( date, insertOpenFiles ).then( modifieds =>
		{
			modifieds.forEach( modified => console.log( modified.path ) );

			this.modifieds = modifieds;
		});
	}


	onDateChange(date:Date):void
	{
		console.log( this, this.modifieds )
		this.getModifiedList( date, false );
	}
}
