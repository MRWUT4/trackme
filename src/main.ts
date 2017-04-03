import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if( environment.production ) 
{
	enableProdMode();
}

// import * as child_process from 'child_process';
// const spawn = require('child_process').spawn;
// var childProcess = new ChildProcess();

// let remote = require('electron').remote;
// let fs = remote.require('fs');

// const electron = require('electron');

// import { child_pro}

// console.log( require('child_process').exec );

// System.config({
//   map: {
//     'child_process': '@node/child_process'
//   }
// });

// import * as child_process from 'child_process';
// import { remote } from 'electron';

// console.log( child_process );

// import * as fs from 'fs';
// import * as child_process from 'child_process';

// let exec = child_process.exec;

// const { remote } = require('electron')

// import { exec } from 'child_process';

// var string = exec( "ls" );


// console.log( fs )
// console.log( System.get('electron') );

platformBrowserDynamic().bootstrapModule( AppModule );