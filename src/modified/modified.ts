export class Modified
{
	private _clock:String;

	public distance:Number = 0;


	constructor(

		public time:number = 0,
		public path:String = ''

	){}


	set clock(value:String)
	{
		this._clock = value;
	}

	get clock():String
	{
		return this._clock == undefined ? String( this.time ) : this._clock;
	}


	get suffix():String
	{
		/*
		let file:String = this.path.split( '/' ).pop();

		let list:any[] = file.split( '.' );
		list.shift();

		let value:String = list.join( '.' );

		return value;
		/*/
		return this.path.split( '/' ).pop().split( '.' ).pop();
		//*/
	}

	get minutes():number
	{
		return Math.floor( this.time / 1000 / 60 );
	}


	clone():Modified
	{
		return new Modified( this.time, this.path );
	}
}
