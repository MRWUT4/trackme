import { Component, Input, NgZone } from '@angular/core';
import { Modified } from '../modified/modified';
import { ModifiedService } from '../modified/modified.service';

@Component(
{
	selector: 'suffix-picker',
	template: require( './suffixpicker.component.html' ),
	styles: [ require( './suffixpicker.component.css' ) ],
	providers: [ ModifiedService ]
})
export class SuffixPickerComponent
{
  modifieds:Modified[];
	suffixList:String[];


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
			this.suffixList = this.getSuffixList( this.modifieds );

			this.ngZone.run( () => {} ); // <- Electron template update fix.
		});
	}


	getSuffixList(modifieds:Modified[]):String[]
	{
			let list:String[] = [];

			modifieds.forEach( modified =>
			{
				let suffix:String = modified.path.split( '/' ).pop().split( '.' )[ 1 ];
				let isInList:String = list.find( element => element == suffix );

				if( !isInList )
					list.push( suffix );
			})

			return list;
	}
}
