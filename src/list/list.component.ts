import { Component } from '@angular/core';
import { Process } from '../process/process';
import { ProcessService } from '../process/process.service';

@Component(
{
	selector: 'list-component',
	templateUrl: './list.component.html',
	providers: [ ProcessService ]
	// styleUrls: ['./app.component.css']
})
export class ListComponent
{
	processes: Process[];

	// getHeroes(): void 
	// {
	// 	this.processes = this.processService.getProcesses();
	// }

	constructor(private processService: ProcessService){}

	ngOnInit()
	{
		this.processes = this.processService.getProcesses();
	}
}
