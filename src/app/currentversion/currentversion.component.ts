import { Component, OnInit, NgZone } from '@angular/core';
import { CurrentVersionService } from '../currentversion/currentversion.service';
import { remote } from 'electron';
import { shell } from 'electron';

@Component(
{
    selector: 'current-version',
    template: require( './currentversion.component.html' ),
    styles: [ require( './currentversion.component.css' ) ],
    providers: [ CurrentVersionService ]
})
export class CurrentVersionComponent implements OnInit
{
  private openDownloadURL:Function = () => {};

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
    this.currentVersionService.getCurrentVersion().subscribe( (json:any) =>
    {
      this.showBannerIfNewVersionIsAvailable( json );
      this.openDownloadURL = this.curryOpenDownloadURL( json.url );

      this.render();
    });
  }

  showBannerIfNewVersionIsAvailable(json:any)
  {
    let isProd = remote.process.execPath.search( 'electron-prebuilt' ) === -1;
    // isProd = true;
    this.hasNewVersion = isProd && remote.app.getVersion() != json.version;
  }

  curryOpenDownloadURL(url:string):Function
  {
    return () =>
    {
      shell.openExternal( url );
    }
  }


  onCloseClick():void
  {
    this.hasNewVersion = false;
    this.render();
  }

  onDownloadClick():void
  {
    this.openDownloadURL();
  }
}
