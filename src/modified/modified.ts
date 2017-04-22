export class Modified
{
	private _clock:String;


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
		return this.path.split( '/' ).pop().split( '.' ).pop();
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
