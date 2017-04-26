import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Selection } from '../suffixselection/selection';
import { SuffixSelectionService } from '../suffixselection/suffixselection.service';

@Component(
{
	selector: 'suffix-picker',
	template: require( './suffixpicker.component.html' ),
	styles: [ require( './suffixpicker.component.css' ) ],
	providers: [ SuffixSelectionService ]
})
export class SuffixPickerComponent implements OnInit
{
	static BUTTON_ID_ALL:String = 'all';
	static BUTTON_ID_NONE:String = 'none';

	private _suffixSelectionList:Selection[];

	// @Input() suffixSelectionList:Selection[];
	@Output() change = new EventEmitter();



	get suffixSelectionList():Selection[]
	{
		return this._suffixSelectionList;
	}

	@Input( 'suffixSelectionList' )
	set suffixSelectionList(value:Selection[])
	{
		this._suffixSelectionList = value;
		// this.setSelectionList();
		this.getSelectionList();
	}



	constructor(private suffixSelectionService:SuffixSelectionService){}

	ngOnInit():void
	{
			this.getSelectionList();
	}


	getSelectionList()
	{
		this.suffixSelectionService.getSelectionList().then( selections =>
		{
			this.transferSelectionsFromTo( selections, this._suffixSelectionList );
			this.change.emit();
		});
	}

	transferSelectionsFromTo(updated:Selection[], current:Selection[]):void
	{
		if( current )
		{
			current.forEach( selection =>
			{
				let value = this.getSelectionByValue( updated, selection.value );

				if( value )
					selection.selected = value.selected;
			});
		}
	}

	setSelectionList()
	{
		// let list = this.suffixSelectionList.filter( selection => selection.selected );
		this.suffixSelectionService.setSelectionList( this.suffixSelectionList );
		this.change.emit();
	}


	onChange(event):void
	{
			let checkbox = event.target;

			let suffixSelection = this.getSelectionByValue( this.suffixSelectionList, checkbox.id )
			suffixSelection.selected = checkbox.checked;

			this.setSelectionList();
	}

	onClick(event:any)
	{
		switch( event.target.id )
		{
			case SuffixPickerComponent.BUTTON_ID_ALL:
				this.suffixSelectionList.forEach( selection => selection.selected = true );
				break;

			case SuffixPickerComponent.BUTTON_ID_NONE:
				this.suffixSelectionList.forEach( selection => selection.selected = false );
				break;
		}

		// this.suffixSelectionList = this.suffixSelectionList;
		this.setSelectionList();
	}

	getSelectionByValue(list:Selection[], value:String)
	{
		return list.find( element => element.value == value );
	}
}
