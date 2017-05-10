import { Modified } from './modified';

export class GroupModified
{
  static byCondition(modifieds:Modified[], condition:Function):any[]
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

  static byDistance(modifieds:Modified[]):any[]
  {
    return GroupModified.byCondition( modifieds, ( a, b ) => a.distance > 0 );
  }

  static byHour(modifieds:Modified[], rangeA:number, rangeB:number):any[]
  {
    let outOfRange = [];
    let inRange = [];

    let list = [ inRange, outOfRange ];

    modifieds.forEach( modified =>
    {
      let hours = new Date( modified.time ).getHours();

      if( hours >= rangeA && hours < rangeB )
        inRange.push( modified )
      else
        outOfRange.push( modified );
    });

    return list;
  }

  static ungroup(groups:any[]):any[]
  {
  		let list = [];
  		groups.forEach( element => list = list.concat( element ) );

  		return list;
  }
}
