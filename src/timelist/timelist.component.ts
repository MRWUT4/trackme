import { Component, OnInit, NgZone } from '@angular/core';
import { Modified } from '../modified/modified';
import { ModifiedService } from '../modified/modified.service';
import { Selection } from '../suffixpicker/selection';

@Component(
{
	selector: 'timelist',
	template: require( './timelist.component.html' ),
	styles: [ require( './timelist.component.css' ) ],
	providers: [ ModifiedService ]
})
export class TimeListComponent implements OnInit
{
	static BUTTON_ID_ALL:String = 'all';
	static BUTTON_ID_NONE:String = 'none';

	public date:Date = new Date();

	// previousTime:String = null;
	modifieds:Modified[];
	modifiedsFiltered:Modified[];
	suffixList:String[];
	suffixSelectionList:Selection[];


	constructor(private ngZone:NgZone, private modifiedService:ModifiedService){}

	ngOnInit():void
	{
			this.getModifiedList();
	}

	render()
	{
		this.ngZone.run( () => {} ); // <- Electron template update fix.
	}


	/** Service handling. */
	getModifiedList(date:Date = null):void
	{
		this.modifieds = [];

		this.modifiedService.getModifiedList( date ).then( modifieds =>
		{
			this.modifieds = modifieds;
			this.suffixList = this.getSuffixList( this.modifieds );
			this.suffixSelectionList = this.getSuffixSelectionList( this.suffixList );

			this.updateFilteredModifiedList();
			this.render();
		});
	}

	/** TimeValue handling. */
	modClearRepeatingPathValues(modifieds:Modified[]):Modified[]
	{
		let previousMinutes = Number.NaN;

		modifieds.forEach( (modified, index) =>
		{
			var minutes = modified.minutes;

			if( index == 0 || previousMinutes != minutes )
				previousMinutes = minutes;
			else
				modified.clock = '';
		});

		return modifieds;
	}


	/** DatePicker handling. */
	onDateChange(date:Date):void
	{
		this.getModifiedList( date );
	}


	/** SuffixPicker handling. */
	getSuffixList(modifieds:Modified[]):String[]
	{
			let list:String[] = [];

			modifieds.forEach( modified =>
			{
				let suffix:String = modified.suffix;
				let isInList:String = list.find( element => element == suffix );

				if( !isInList )
					list.push( suffix );
			});

			return list;
	}

	getSuffixSelectionList(list:String[]):Selection[]
	{
		let result = list.map( element => new Selection( element ) );
		return result;
	}

	getSelectionById(list:Selection[], id:String)
	{
		return list.find( element => element.id == id );
	}

	onSuffixPickerChange(event:any)
	{
		let checkbox = event.target;

		let suffixSelection = this.getSelectionById( this.suffixSelectionList, checkbox.id )
		suffixSelection.selected = checkbox.checked;

		this.updateFilteredModifiedList();
	}

	onSuffixPickerClick(event:any)
	{
		switch( event.target.id )
		{
			case TimeListComponent.BUTTON_ID_ALL:
				this.suffixSelectionList.forEach( selection => selection.selected = true );
				break;

			case TimeListComponent.BUTTON_ID_NONE:
				this.suffixSelectionList.forEach( selection => selection.selected = false );
				break;
		}

		this.suffixSelectionList = this.suffixSelectionList;
		this.updateFilteredModifiedList();
	}

	/** Filter handling. */
	updateFilteredModifiedList():void
	{
		let modifieds = this.getClonedModifiedList( this.modifieds );
		modifieds = this.getFilteredModifiedList( modifieds, this.suffixSelectionList );

		this.modifiedsFiltered = this.modClearRepeatingPathValues( modifieds );

		this.render();
	}

	getClonedModifiedList(modifieds:Modified[]):Modified[]
	{
		return modifieds.map( modified => modified.clone() );
	}

	getFilteredModifiedList(modifieds:Modified[], filters:Selection[]):Modified[]
	{
		return modifieds.filter( modified => this.getSelectionById( this.suffixSelectionList, modified.suffix ).selected );
	}
}
