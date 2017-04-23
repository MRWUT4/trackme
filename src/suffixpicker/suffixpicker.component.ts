import { Component, Input } from '@angular/core';
import { Selection } from './selection';

@Component(
{
	selector: 'suffix-picker',
	template: require( './suffixpicker.component.html' ),
	styles: [ require( './suffixpicker.component.css' ) ]
})
export class SuffixPickerComponent
{
	@Input() suffixSelectionList:Selection[];
}
