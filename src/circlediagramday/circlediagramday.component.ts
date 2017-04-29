import { Component, Input, Directive, ViewChild, OnInit } from '@angular/core';
import { Modified } from '../modified/modified';
import { GroupModified } from '../modified/groupmodified';

@Component(
{
  selector: 'circle-diagram-day',
  template: require( './circlediagramday.component.html' ),
  styles: [ require( './circlediagramday.component.css' ) ]
})
export class CircleDiagramDay
{
  @Input() diameter:number = 150;
  @Input() modifieds:any[]
  @Input() hourStart:number = 6;
  @Input() hourEnd:number = 18;

  @ViewChild( 'canvasElement' ) canvasReference;

  public modifiedsGrouped:any[]

  public colorActive:String = '#66B2E8';
  public colorInactive:String = '#ddd';
  public colorBackground:String = '#fff';
  private drawCircle:Function;
  private drawTimeSlots:Function;


  constructor(){}


  ngOnChanges()
  {
    let gap = .3;
    let ctx = this.setupCanvas( this.canvasReference );

    this.drawCircle = this.curryDrawCircle( ctx );
    this.drawTimeSlots = this.curryDrawTimeSlots( ctx );


    if( this.modifieds && this.modifieds.length > 0 )
    {
      let modifiedsSplitByHour = GroupModified.byHour( this.modifieds, this.hourStart, this.hourEnd );
      let modifiedsSplitGrouped = modifiedsSplitByHour.map( modifieds => GroupModified.byDistance( modifieds ) );


      this.clearCanvas( ctx, this.diameter );

      this.drawCircle( this.diameter,  1, this.colorInactive );
      this.drawTimeSlots( modifiedsSplitGrouped[ 0 ], this.diameter, 1, this.colorActive );
      this.drawCircle( this.diameter, 1 - gap, this.colorBackground );

      this.drawCircle( this.diameter, 1 - gap - .1, this.colorInactive );
      this.drawTimeSlots( modifiedsSplitGrouped[ 1 ], this.diameter, 1 - gap - .1, this.colorActive );
      this.drawCircle( this.diameter, 1 - gap * 2 - .1, this.colorBackground );
    }
    else
    {
      this.drawCircle( this.diameter,  1, this.colorInactive );
      this.drawCircle( this.diameter, 1 - gap, this.colorBackground );

      this.drawCircle( this.diameter, 1 - gap - .1, this.colorInactive );
      this.drawCircle( this.diameter, 1 - gap * 2 - .1, this.colorBackground );
    }
  }

  setupCanvas(canvasReference):CanvasRenderingContext2D
  {
    let canvas = this.canvasReference.nativeElement;
    canvas.width = this.diameter;
    canvas.height = this.diameter;

    let ctx = canvas.getContext( '2d' );

    return ctx;
  }

  clearCanvas(ctx:CanvasRenderingContext2D, diameter:number):void
  {
    ctx.clearRect( 0, 0, diameter, diameter );
  }

  curryDrawCircle(ctx:CanvasRenderingContext2D):Function
  {
    return (diameter:number, scale:number, color:string, start:number = 0, end:number) =>
    {
      end = end !== undefined ? end : Math.PI * 2;

      let radius = diameter / 2;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo( radius, radius );
      ctx.arc( radius, radius, radius * scale, start, end );
      ctx.fill();
    }
  }

  curryDrawTimeSlots(ctx:CanvasRenderingContext2D):Function
  {
    return (list:any[], diameter:number, scale:number, color:string) =>
    {
      list.forEach( (modifieds:Modified[]) =>
      {
        if( modifieds.length > 0 )
        {
          let fiveMinutes = 1000 * 60 * 5;
          let first = this.getTimeToAngle( modifieds[ 0 ].time );
          let last = this.getTimeToAngle( modifieds[ modifieds.length - 1 ].time + fiveMinutes );

          this.drawCircle( diameter, scale, color, first, last );
        }
      });
    }
  }

  getTimeToAngle(time:number):number
  {
    let date = new Date( time );
    let radians = ( ( date.getHours() + date.getMinutes() / 60 ) / 12 ) * Math.PI * 2;
    radians += Math.PI * 1.5;

    return radians;
  }
}
