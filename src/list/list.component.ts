import { Component, OnInit } from '@angular/core';
import { Process } from '../process/process';
import { ProcessService } from '../process/process.service';

@Component(
{
	selector: 'list-component',
	templateUrl: './list.component.html',
	providers: [ ProcessService ]
	// styleUrls: ['./app.component.css']
})
export class ListComponent implements OnInit
{
	processes: Process[];

	// getHeroes(): void 
	// {
	// 	this.processes = this.processService.getProcesses();
	// }

	constructor(private processService:ProcessService){}

	ngOnInit():void
	{
		this.getProcesses();
	}

	getProcesses():void
	{
		// var spawn = require( '../../child_process' ).spawn;

		// console.log( spawn );

		// this.processes = this.processService.getProcesses();

		this.processService.getProcesses().then( processes => this.processes = processes );
	}
}
