import { Component, OnInit, NgZone } from '@angular/core';
import { Modified } from '../modified/modified';
import { ModifiedService } from '../modified/modified.service';
import { Selection } from '../suffixselection/selection';

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

	// public date:Date = new Date( 017, 3, 20 );
	public date:Date = new Date();

	public getTimeWithResolution:Function;
	public getModifiedDistance:Function;

	public resolution:number = 10;
	public modifieds:Modified[];
	public modifiedsFiltered:Modified[];
	public suffixList:String[];
	public suffixSelectionList:Selection[];


	get modifiedsDistanceGrouped():any[]
	{
		return this.getModifiedsGroupedByCondition( this.modifiedsFiltered || [], ( a, b ) => b.distance > 0 );
	}


	constructor(private ngZone:NgZone, private modifiedService:ModifiedService){}


	ngOnInit():void
	{
			this.getModifiedList( this.date );
			this.getTimeWithResolution = ( time:number ) => { return this.getMinuteResolution( time, this.resolution ) };
			this.getModifiedDistance = this.curryGetModifiedDistance( this.resolution );
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


	/** DatePicker handling. */
	onDateChange(date:Date):void
	{
		this.getModifiedList( date );
	}

	onSuffixPickerChange():void
	{
		console.log( 'onSuffixPickerChange' );
		this.updateFilteredModifiedList();
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


	/** Filter handling. */
	updateFilteredModifiedList():void
	{
		let modifieds = this.getClonedModifiedList( this.modifieds );
		modifieds = this.modTimeResolution( modifieds );
		modifieds = this.getFilteredModifiedList( modifieds, this.suffixSelectionList );
		modifieds = this.modTableRowDistance( modifieds );
		modifieds = this.modClearRepeatingPathValuesInGroup( modifieds );
		modifieds = this.modTableRowDistance( modifieds );
		modifieds = this.modClearRepeatingClockValues( modifieds );

		console.log( 'updateFilteredModifiedList' );
		this.modifiedsFiltered = modifieds;

		this.render();
	}


	/** Modify timeline values. */
	modTimeResolution(modifieds:Modified[]):Modified[]
	{
		modifieds.forEach( modified => modified.time = this.getTimeWithResolution( modified.time ) );
		return modifieds;
	}

	getMinuteResolution(time:number, resolution:number = 1):number
	{
		return  Math.round( time / 1000 / 60 / resolution ) * resolution * 1000 * 60;
	}

	getTimeAsMinutes(time:number):number
	{
		return Math.floor( ( time / 1000 ) / 60 );
	}

	modClearRepeatingPathValuesInGroup(modifieds:Modified[]):Modified[]
	{
		let groups = this.getModifiedsGroupedByCondition( modifieds, ( a, b ) => b.distance > 0 );

		groups.forEach( (group, index) =>
		{
			group = this.getElementsSortedByProperty( group, 'path' );
			group = this.getRemovePathDuplicates( group );
			group = this.getElementsSortedByProperty( group, 'time' );

			groups[ index ] = group;
		});

		let list = this.getUngroupedList( groups );

		return list;
	}

	modClearRepeatingClockValues(modifieds:Modified[]):Modified[]
	{
		let groups = this.getModifiedsGroupedByCondition( modifieds, ( a, b ) => a.distance > 0 );

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


	curryGetModifiedDistance(resolution:number = 1):Function
	{
		return (current:Modified, previous:Modified):number =>
		{
			var value = ( this.getTimeAsMinutes( current.time ) - ( this.getTimeAsMinutes( previous.time ) + resolution ) );
			return value;
		}
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

			if( !previous /*|| index == modifieds.length - 1*/ || modified.path != previous.path )
				result.push( modified );
		});

		let previous = null;

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

	getModifiedsGroupedByCondition(modifieds:Modified[], condition:Function):any[]
	{
		var list = [ [] ];
		var section = list[ 0 ];

		modifieds.forEach( modified =>
		{
			let last = section[ section.length - 1 ];

			if( last && condition( last, modified ) )
			{
				section = [];
				list.push( section );
			}

			section.push( modified );
		})

		return list;
	}

	getUngroupedList(groups:any[]):any[]
	{
		let list = [];
		groups.forEach( element => list = list.concat( element ) );

		return list;
	}
}
