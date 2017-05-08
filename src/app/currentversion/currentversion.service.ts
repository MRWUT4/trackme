import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class CurrentVersionService
{
  private currentVersionURL:string = 'http://davidochmann.de/content/download/trackme/';
  private currentVersionPHP:string = 'currentversion.php';

  constructor (private http: Http){}


  getCurrentVersion():Observable<String>
  {
    let url = this.currentVersionURL + this.currentVersionPHP;

    return this.http.get( url )
      .map( this.mapRequestDate( this.currentVersionURL ) )
      .catch( this.handleError );
  }

  mapRequestDate(url:String)
  {
    return (response:Response) =>
    {
      let json = response.json();
      json.url = url + json.name;

      return json || { };
    }
  }

  handleError(error: Response | any)
  {
    return Observable.throw( error.message );
  }
}
