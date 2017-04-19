export class ValuePair
{
  private _value:any;

  get value():any
  {
    var result = this._value;
    result = typeof result == 'string' ? '\'' + result + '\'' : result;

    return result;
  }

  set value(value:any)
  {
    this._value = value;
  }


  constructor(public property:String, value:any)
  {
    this.value = value;
  }


  toString():String
  {
    return this.property + ' ' + this.value;
  }
}
