import { Component, OnInit } from '@angular/core';
import { Modified } from '../modified/modified';
import { ModifiedService } from '../modified/modified.service';


@Component(
{
	selector: 'list-component',
	template: require( './list.component.html' ),
	providers: [ ModifiedService ] 
	// styleUrls: ['./app.component.css']
})
export class ListComponent implements OnInit
{
	modifieds: Modified[];

	constructor(private modifiedService:ModifiedService){}

	ngOnInit():void
	{
		this.getModifiedList();
	}

	getModifiedList():void
	{
		this.modifiedService.getModifiedList().then( modifieds => this.modifieds = modifieds );
	}
}
