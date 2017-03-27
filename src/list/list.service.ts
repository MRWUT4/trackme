import { Injectable } from '@angular/core';

@Injectable()
export class ListService 
{
  get List() 
  {
    return [ 0, 1, 2, 3, 4, 5 ];
  }
}