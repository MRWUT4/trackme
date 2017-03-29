import { Injectable } from '@angular/core';

import { Process } from './process';
import { PROCESSES } from './mock-process';


@Injectable()
export class ProcessService 
{
	getProcesses(): Promise<Process[]>
	{
		// return Promise.resolve( PROCESSES );

		return new Promise(resolve => 
		{
			// Simulate server latency with 2 second delay
			setTimeout( () => 
			{
				resolve( PROCESSES ), 200 
			});
	    });
	}
}