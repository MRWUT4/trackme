import { Component, Input, EventEmitter, Output } from '@angular/core';
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
  private currentDate:Date = new Date();

  @Input() date:Date = new Date();
  @Output() dateChange = new EventEmitter();


  get year():number
  {
    return this.date.getFullYear();
  }

  set year(value:number)
  {
    this.date.setFullYear( value );
    this.sendDateChangeEvent();
  }


  get month():number
  {
    return this.date.getMonth() + 1;
  }

  set month(value:number)
  {
    this.date.setMonth( value - 1 );
    this.sendDateChangeEvent();
  }


  get day():number
  {
    return this.date.getDate();
  }

  set day(value:number)
  {
    this.date.setDate( value );
    this.sendDateChangeEvent();
  }


  sendDateChangeEvent()
  {
    if( this.currentDate == null || this.date.getTime() != this.currentDate.getTime() )
    {
      this.currentDate.setTime( this.date.getTime() );
      this.dateChange.next( this.date );
    }
  }
}
