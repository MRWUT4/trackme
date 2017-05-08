import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'replaceNull'})
export class ReplaceNullPipe implements PipeTransform
{
  transform(value:string, replace:string):string
  {
    return value == null ? replace : value;
  }
}
