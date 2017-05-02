import { Component, Input } from '@angular/core';
import { Modified } from '../modified/modified';
import { GroupModified } from '../modified/groupmodified';

@Component(
{
	selector: 'progress-text',
	template: require( './progresstext.component.html' ),
	styles: [ require( './progresstext.component.css' ) ],
})
export class ProgressTextComponent
{
	@Input() modifieds:Modified[];

  // hours = 6;
	title = 'trackme';


	get totalTime():number
	{
		let group:any[] = GroupModified.byDistance( this.modifieds );

		let milliseconds = group.reduce( (result, list) =>
		{
			if( list && list.length > 0 )
			{
        let tenMinutes = 1000 * 60 * 10;

				let first = list[ 0 ];
				let last = list[ list.length - 1 ];

				let time = last.time + tenMinutes - first.time;

				result += time;
			}

			return result;

		}, 0 );

		let hours = ( milliseconds / 1000 / 60 / 60 );

		return hours;
	}
}
