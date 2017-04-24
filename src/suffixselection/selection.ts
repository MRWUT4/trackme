export class Selection
{
  constructor(

    public value:String = null,
    public selected:Boolean = true

  ){};


  get active():number
  {
    return this.selected ? 1 : 0;
  }

  set active(value:number)
  {
    this.selected = value == 1 ? true : false;
  }



  toString():String
  {
    return this.value + ": " + this.selected;
  }
}
