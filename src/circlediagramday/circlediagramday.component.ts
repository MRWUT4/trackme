import { Component, Input, Directive, ViewChild, OnInit } from '@angular/core';
import { Modified } from '../modified/modified';

@Component(
{
  selector: 'circle-diagram-day',
  template: require( './circlediagramday.component.html' ),
  styles: [ require( './circlediagramday.component.css' ) ]
})
export class CircleDiagramDay
{
  @Input() diameter:number = 200;

  @ViewChild( 'canvasElement' ) canvasReference;

  _modifiedsGrouped:any[]

  colorActive:String = '#66B2E8';
  colorInactive:String = '#ddd';
  colorBackground:String = '#fff';


  @Input() set modifiedsGrouped(value:any[])
  {
    this._modifiedsGrouped = value;
    this.render( this._modifiedsGrouped );
  }


  private drawCircle:Function;


  constructor()
  {
  }

  // ngOnChanges()
  // {
  //   console.log( 'ngOnChanges', this._modifiedsGrouped );
  // }

  render(modifiedsGrouped:any[])
  {
    let canvas = this.canvasReference.nativeElement;
    canvas.width = this.diameter;
    canvas.height = this.diameter;

    console.log( modifiedsGrouped )

    let ctx = canvas.getContext( '2d' );

    this.drawCircle = this.curryDrawCircle( ctx );

    this.drawCircle( this.diameter,  1, this.colorInactive );
    this.drawCircle( this.diameter, .8, this.colorBackground );
  }


  curryDrawCircle(ctx:CanvasRenderingContext2D):Function
  {
    return (diameter:number, scale:number, color:string, start:number = 0, end:number) =>
    {
      end = end !== undefined ? end : 2 * Math.PI;

      let radius = diameter / 2;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc( radius, radius, radius * scale, start, end );
      ctx.fill();
    }
  }
}
