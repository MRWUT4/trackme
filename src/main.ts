import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if( environment.production ) 
{
	enableProdMode();
}

import { spawn } from 'child_process';

// const spawn = require('child_process').spawn;
// var childProcess = new ChildProcess();

console.log( spawn );

// platformBrowserDynamic().bootstrapModule( AppModule );
