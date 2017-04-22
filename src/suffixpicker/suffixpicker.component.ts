import { Component, Input } from '@angular/core';

@Component(
{
	selector: 'suffix-picker',
	template: require( './suffixpicker.component.html' ),
	styles: [ require( './suffixpicker.component.css' ) ]
})
export class SuffixPickerComponent
{
	@Input() suffixList:String[];
}
