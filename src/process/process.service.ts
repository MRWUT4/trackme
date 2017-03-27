import { Injectable } from '@angular/core';
import { Process } from './process';

import { PROCESSES } from './mock-process';


@Injectable()
export class ProcessService 
{
	constructor()
	{

	}

	getProcesses(): Process[] 
	{
		return PROCESSES;
	}
}