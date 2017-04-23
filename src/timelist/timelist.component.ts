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
	modClearRepeatingClockValues(modifieds:Modified[]):Modified[]
	{
		let previousMinutes = Number.NaN;

		modifieds.forEach( (current, index) =>
		{
			var previous = modifieds[ index - 1 ];

			if( previous && previous.distance == 0 && current.distance == 0  && index != modifieds.length - 1 )
				current.clock = '';
		});

		return modifieds;
	}

	modTableRowDistance(modifieds:Modified[]):Modified[]
	{
		modifieds.forEach( (current, index) =>
		{
			let previous = modifieds[ index - 1 ];

			if( previous )
				previous.distance = Math.min( 4, this.getModifiedDistance( current, previous ) );
		});

		return modifieds;
	}

	getModifiedDistance(current:Modified, previous:Modified):number
	{
		return Math.floor( ( current.time - previous.time ) / 1000000 );
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
		modifieds = this.getRemovePathDuplicates( modifieds );
		this.modifiedsFiltered = this.modTableRowDistance( modifieds );
		this.modifiedsFiltered = this.modClearRepeatingClockValues( modifieds );

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

	getRemovePathDuplicates(modifieds:Modified[]):Modified[]
	{
		let result:Modified[] = [];

		modifieds.forEach( (modified, index) =>
		{
			let previous = modifieds[ index - 1 ];

			if( !previous || index == modifieds.length - 1 || modified.path != previous.path )
				result.push( modified );
		});

		return result;
	}
}
