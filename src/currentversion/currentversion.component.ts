import { Component, OnInit, NgZone } from '@angular/core';
import { CurrentVersionService } from '../currentversion/currentversion.service';
import { remote } from 'electron';

@Component(
{
    selector: 'current-version',
    template: require( './currentversion.component.html' ),
    styles: [ require( './currentversion.component.css' ) ],
    providers: [ CurrentVersionService ]
})
export class CurrentVersionComponent implements OnInit
{
  public downloadURL:string = 'http://davidochmann.de';
  public hasNewVersion:Boolean = false;

  constructor(private ngZone:NgZone, private currentVersionService:CurrentVersionService){}

  render()
	{
		this.ngZone.run( () => {} ); // <- Electron template update fix.
	}

  ngOnInit()
  {
    this.getCurrentVersion();
  }

  getCurrentVersion():void
  {
    this.currentVersionService.getCurrentVersion().subscribe( (currentVersion:string) =>
    {
      this.retrieveCurrentVersion( currentVersion );
      this.render();
    });
  }

  retrieveCurrentVersion(currentVersion:string)
  {
    const isProd = remote.process.execPath.search( 'electron-prebuilt' ) === -1;

    // if( isProd && remote.app.getVersion() !=  )

    // let window = new BrowserWindow( { width:200, height:300 } );

    this.hasNewVersion = remote.app.getVersion() != currentVersion;

    console.log( remote.process.version, remote.process.versions );
    console.log( remote.app.getVersion()  )
    console.log( remote.app.getVersion(), currentVersion, this.hasNewVersion );

    console.log( this );
  }

  downloadClickHandler():void
  {
    console.log( 'downloadClickHandler' );
  }
}
