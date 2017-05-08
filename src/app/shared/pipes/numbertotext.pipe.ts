import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'numberToText'})
export class NumberToTextPipe implements PipeTransform
{
  transform(value:number, replace:string):string
  {
    // [ .4, .6, .75, 1.3, 1.1 ].forEach( value =>
    // {
    if( value > 0 )
    {
      let rounded = this.roundToNextQuarter( value );
      let biggerThenOne = rounded > 1;
      let quarters = String( rounded ).split( '.' );
      let hours = this.hoursToText( quarters[ 0 ] );
      let minutes = this.minutesToText( quarters[ 1 ], biggerThenOne );
      // let and = rounded % 1 != 0 ? ' and ' : '';
      // let suffix = biggerThenOne ? 'hour' : 'hours';

      let result = ( hours + minutes );
    //
    //   console.log( rounded, result );
    // });

      return result; 
    }
    else
      return 'zero hours';
    // return 'result';
  }

  roundToNextQuarter(value:number):number
  {
    let result = Math.round( value / .25 ) * .25;
    return result;
  }


  hoursToText(value:string):string
  {
    switch( value )
    {
        case '1':
          return 'one';

        case '2':
          return 'two';

        case '3':
          return 'three';

        case '4':
          return 'four';

        case '5':
          return 'five';

        case '6':
          return 'six';

        case '7':
          return 'seven';

        case '8':
          return 'eight';

        case '9':
          return 'nine';

        case '10':
          return 'ten';

        case '11':
          return 'eleven';

        case '12':
          return 'twelve';

        case '13':
          return 'thirtenn';

        case '14':
          return 'fourteen';

        case '15':
          return 'fifteen';

        case '16':
          return 'sixteen';

        case '17':
          return 'seventeen';

        case '18':
          return 'eightteen';

        case '19':
          return 'nineteen';

        case '20':
          return 'twenty';

        case '21':
          return 'twenty one';

        case '22':
          return 'twenty two';

        case '23':
          return 'twenty three';

        case '24':
          return 'twenty four';

        default:
          return '';
    }
  }

  minutesToText(value:string, biggerThenOne:boolean = false):string
  {
    switch( value )
    {
        case '25':
          return biggerThenOne ? ' and one quarter of an hour' : 'one quarter of an hour';

        case '5':
          return biggerThenOne ? ' and a half hours' : 'half an hour';

        case '75':
          return biggerThenOne ? ' and three quarters of an hour' : 'three quarters of an hour';

        default:
          return biggerThenOne ? ' hours' : ' hour';
    }
  }
}
