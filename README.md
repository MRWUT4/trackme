# trackme
trackme keeps track of all your recently modified files, sorts and filters them and then displays a coherent list of start and end times for every session on your pc or mac. All of your data is then saved into a local sqlite database.

## Prerequisites
You will need to have [Git](https://git-scm.com/) and [Node.js (5.x and above) + NPM (3.x and above)](http://nodejs.org). We generally suggest installing [`NVM`](https://github.com/creationix/nvm) to manage Node versions. Once those are installed, you will need to install the `typings` NPM package globally. `Typings` handles the typescript definition files for our application.

## Getting started

First you will need to clone the repo; then you can install the necessary NPM packages and run the app.

```bash
# Clone the repo and enter it
git clone https://github.com/mrwut4/trackme.git
cd electrogram

# Install dependencies
npm i

# Install type definitions
typings install

# To build only
npm run build

# To build and watch for changes
npm run watch

# Start the Electron app
npm start # runs "electron src"
```

## The code
Here is a quick overview of the project structure:
```
electrogram/
 ├──src/                       * contains the electron app script, html file, and all Angular code
 │   │
 │   ├──customDefinitions.d.ts * any TypeScript definitions that we need to provide
 │   ├──index.html             * parent HTML page where we include our built javascript files
 │   ├──main.js                * NodeJS script that bootstraps the Electron app
 │   ├──menuTemplate.js        * javascript config for the application menu
 │   │   
 │   ├──app/                   * our Angular app has one "app" component, and this holds all the related code
 │   │   ├──app.css            * app component styles
 │   │   ├──app.html           * app component template
 │   │   ├──app.ts             * app component functionality
 │   │   └──canvasService.ts   * Angular service that aids with Canvas creation and modification
 │   │
 │   └──assets/                * static assets are served here
 │       ├──css/               * global styles
 │       ├──data/              * a list of available photo filters in JSON format
 │       └──images/            * app logo and icon
 │
 ├──webpack.config.js          * configuration file that Webpack uses to build the app
 ├──tsconfig.json              * config that webpack uses for typescript
 ├──typings.json               * our typings manager
 └──package.json               * what npm uses to manage it's dependencies and scripts
 ```
