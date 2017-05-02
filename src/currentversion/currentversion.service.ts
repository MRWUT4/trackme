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

  getCurrentVersion():Promise<String>
  {
    return new Promise( resolve =>
    {
      let url = this.currentVersionURL + this.currentVersionPHP;
      console.log( 'getCurrentVersion', url )

      this.http.get( url ).map( this.mapRequestDate ).catch( this.handleError );
    });
  }

  mapRequestDate(response:Response)
  {
    let body = response.json();

    console.log( body );

    return body.data || {};
  }

  private handleError (error: Response | any)
  {
    console.log( error );
    return Observable.throw( error.message );
  }

  // handleError(error: Response | any){}
}
