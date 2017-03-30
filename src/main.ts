import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if( environment.production ) 
{
	enableProdMode();
}

// import * as child_process from 'child_process';
// const exec: any = eval("require('child_process').exec");
// const spawn = require('child_process').spawn;
// var childProcess = new ChildProcess();

// let remote = require('electron').remote;
// let fs = remote.require('fs');

// const electron = require('electron');

// import { remote, ipcRenderer } from 'electron';	 

platformBrowserDynamic().bootstrapModule( AppModule );