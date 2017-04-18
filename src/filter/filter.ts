export class FilterElement
{
  constructor(public id:string, public method:Function){}
}

export class Filter
{
  public apply;

  constructor(private filters:FilterElement[])
  {
    this.apply = this.curryApply( this.filters );
  }

  curryApply(filters:FilterElement[])
  {
    return (list:String[]) => {

      var result = list.concat();

      filters.forEach( (filter:FilterElement) =>
      {
        var method = filter.method;
        result = method( result );
      });

      return result;
    }
  }
}
