import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Selection } from '../suffixselection/selection';
import { SuffixSelectionService } from '../suffixselection/suffixselection.service';

@Component(
{
	selector: 'suffix-picker',
	template: require( './suffixpicker.component.html' ),
	styles: [ require( './suffixpicker.component.css' ) ],
	providers: [ SuffixSelectionService ]
})
export class SuffixPickerComponent
{
	static BUTTON_ID_ALL:String = 'all';
	static BUTTON_ID_NONE:String = 'none';

	@Input() suffixSelectionList:Selection[];
	@Output() change = new EventEmitter();


	constructor(private suffixSelectionService:SuffixSelectionService){}

	ngOnInit():void
	{
			this.getSelectedList();
	}


	getSelectedList()
	{
		this.suffixSelectionService.getSelectionList().then( selections =>
		{
			console.log( selections );
			// this.modifieds = modifieds;
			// this.suffixList = this.getSuffixList( this.modifieds );
			// this.suffixSelectionList = this.getSuffixSelectionList( this.suffixList );
			//
			// this.updateFilteredModifiedList();
			// this.render();
		});
	}

	setSelectedList()
	{
		let list = this.suffixSelectionList.filter( selection => selection.selected );
		this.suffixSelectionService.setSelectionList( list );

		this.change.emit();
	}


	onChange(event):void
	{
			let checkbox = event.target;

			let suffixSelection = this.getSelectionById( this.suffixSelectionList, checkbox.id )
			suffixSelection.selected = checkbox.checked;

			this.setSelectedList();
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
		this.setSelectedList();
	}

	getSelectionById(list:Selection[], id:String)
	{
		return list.find( element => element.id == id );
	}
}
