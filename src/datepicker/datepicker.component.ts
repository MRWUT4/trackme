import { Component, Input } from '@angular/core';
import { Modified } from '../modified/modified';
import { ModifiedService } from '../modified/modified.service';


@Component(
{
	selector: 'datepicker',
	template: require( './datepicker.component.html' ),
	styles: [ require( './datepicker.component.css' ) ],
	providers: [ ModifiedService ]
})
export class DatePickerComponent
{
  @Input() date:Date = new Date();

  get year():Number
  {
    return 2017;
  }

  set year(value:Number)
  {

  }
}
