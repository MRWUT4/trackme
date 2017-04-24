export class Selection
{
  constructor(

    public id:String = null,
    public selected:Boolean = true

  ){};

  toString():String
  {
    return this.id + ": " + this.selected;
  }
}
