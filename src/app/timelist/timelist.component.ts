import { Component, OnInit, NgZone } from '@angular/core';
import { Modified } from './modified/modified';
import { GroupModified } from './modified/groupmodified';
import { ModifiedService } from './modified/modified.service';
import { Selection } from './suffixselection/selection';

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

	// public date:Date = new Date( 2017, 3, 29 );
	public date:Date = new Date( 2017, 4, 8 );
	// public date:Date = new Date();

	public getTimeWithResolution:Function;
	public getModifiedDistance:Function;

	public resolution:number = 10;
	public modifieds:Modified[];
	public modifiedsFiltered:Modified[] = [];
	public suffixList:String[];
	public suffixSelectionList:Selection[];
	public modifiedsDistanceGrouped:any[];


	/**
 	 * Getter / Setter
	 */

	getMinuteResolution(time:number, resolution:number = 1):number
	{
		return  Math.round( time / 1000 / 60 / resolution ) * resolution * 1000 * 60;
	}

	getTimeAsMinutes(time:number):number
	{
		return Math.floor( ( time / 1000 ) / 60 );
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
			if( !result.find( element => element.path == modified.path ) )
				result.push( modified );
		});

		return result;
	}

	getElementsSortedByProperty(modifieds:Modified[], property:string):Modified[]
	{
		modifieds.sort( (a:Modified, b:Modified) =>
		{
			if( a[ property ] > b[ property ] )
				return 1;
			if( a[ property ] < b[ property ] )
				return - 1;
			else
				return 0;
		});

		return modifieds;
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
		list.sort();
		let result = list.map( element => new Selection( element ) );

		return result;
	}

	getSelectionById(list:Selection[], id:String)
	{
		return list.find( element => element.value == id );
	}



	/**
 	 * Interface functions
	 */

	constructor(private ngZone:NgZone, private modifiedService:ModifiedService){}

	ngOnInit():void
	{
			this.getTimeWithResolution = ( time:number ) => { return this.getMinuteResolution( time, this.resolution ) };
			this.getModifiedDistance = this.curryGetModifiedDistance( this.resolution );

			this.setupModifiedList( this.date );
	}

	render()
	{
		this.ngZone.run( () => {} ); // <- Electron template update fix.
	}


	/** Curry functions. */
	curryGetModifiedDistance(resolution:number = 1):Function
	{
		return (current:Modified, previous:Modified):number =>
		{
			var value = ( this.getTimeAsMinutes( current.time ) - ( this.getTimeAsMinutes( previous.time ) + resolution ) );
			return value;
		}
	}


	/** Service handling. */
	setupModifiedList(date:Date = null, updateSuffixList:Boolean = true):void
	{
		this.modifieds = [];

		this.modifiedService.getModifiedList( date ).subscribe( modifieds =>
		{
			this.modifieds = modifieds;

			this.suffixList = this.getSuffixList( this.modifieds );
			this.suffixSelectionList = this.getSuffixSelectionList( this.suffixList );

			this.setupFilteredModifiedList();
		});
	}


	/** Filter handling. */
	setupFilteredModifiedList():void
	{
		let modifiedsFiltered = this.getClonedModifiedList( this.modifieds );
		modifiedsFiltered = this.modTimeResolution( modifiedsFiltered );
		modifiedsFiltered = this.getFilteredModifiedList( modifiedsFiltered, this.suffixSelectionList );
		modifiedsFiltered = this.modTableRowDistance( modifiedsFiltered );
		modifiedsFiltered = this.modClearRepeatingPathValuesInGroup( modifiedsFiltered );
		modifiedsFiltered = this.modTableRowDistance( modifiedsFiltered );
		modifiedsFiltered = this.modClearRepeatingClockValues( modifiedsFiltered );

		this.modifiedsFiltered =  modifiedsFiltered;
		this.render();
	}


	/** Event handling. */
	onDateChange(date:Date):void
	{
		this.setupModifiedList( date );
	}

	onSuffixPickerChange():void
	{
		this.setupFilteredModifiedList();
	}


	/** Modify timeline values. */
	modTimeResolution(modifieds:Modified[]):Modified[]
	{
		modifieds.forEach( modified => modified.time = this.getTimeWithResolution( modified.time ) );
		return modifieds;
	}

	modClearRepeatingPathValuesInGroup(modifieds:Modified[]):Modified[]
	{
		let groups = GroupModified.byDistance( modifieds );
		let list = groups.map( group => this.getRemovePathDuplicates( group ) );

		let result = GroupModified.ungroup( list );

		return result;
	}

	modClearRepeatingClockValues(modifieds:Modified[]):Modified[]
	{
		let groups = GroupModified.byDistance( modifieds );

		groups.forEach( group =>
		{
			group.forEach( (element, index) =>
			{
				if( index != 0 && index != group.length - 1 )
					element.clock = '';
			});
		})

		return modifieds;
	}

	modTableRowDistance(modifieds:Modified[]):Modified[]
	{
		modifieds.forEach( (current, index) =>
		{
			let previous = modifieds[ index - 1 ];

			if( previous )
				previous.distance = Math.max( 0, Math.min( 5, this.getModifiedDistance( current, previous ) * .1 ) );
		});

		return modifieds;
	}
}
