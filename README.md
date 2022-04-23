# Story Manager

[![CircleCI](https://circleci.com/gh/shirblc/story-manager-ng2.svg?style=shield)](https://circleci.com/gh/shirblc/story-manager-ng2.svg)
[![codecov](https://codecov.io/gh/shirblc/story-manager-ng2/graph/badge.svg)](https://codecov.io/gh/shirblc/story-manager-ng2)
[![Known Vulnerabilities](https://snyk.io/test/github/shirblc/story-manager-ng2/badge.svg)](https://snyk.io/test/github/shirblc/story-manager-ng2)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/shirblc/story-manager-ng2)

## Version

Version 1.

Built using the [angular-gulp](https://github.com/shirblc/angular-gulp) repo.

Originally created as an AngularJS app (see [story-manager-ng1](https://github.com/shirblc/story-manager-ng1) and [story-manager-server-ng1](https://github.com/shirblc/story-manager-server-ng1)). Since AngularJS has now reached it's EOL, I've migrated the project to Angular (currently at version 13).

## Requirements

- Node.js

## Installation and Usage

### Developers

1. Download or clone the repo.
2. cd into the project directory.
3. Run ```npm install``` to install dependencies.
4. Run ```npm run compile:dev``` to compile for the files for local development.
5. Run ```npm run serve``` to start the local server.
6. Open localhost:3000.

**For your convenience,** this project utilises Gulp's 'watch' functionality. In order to activate it  while developing, run ```gulp watch```. For more information about Gulp watch, check the [Gulp documentation](https://gulpjs.com/docs/en/getting-started/watching-files/).

### Users

**Not yet ready for users!**

## Contents

### Components

**Located in:** [src/app/components](./src/app/components)

The app contains a Story Manager module (in main.ts), which contains two controllers for two templates:

1. **LibraryManager** (Previously `libraryMgr` + `libraryCtrl`) - Displays the name and synopsis of each added story. Allows users to add and deletec stories.
2. **StoryManager** (Previously `storyMgr` + `storyCtrl`) - Displays the name and synopsis of each chapter within the currently open story. Allows users to edit a story's details, as well sa adding, deleting and editing chapters' details.
	- **storyEdit** - Where the user can edit the story's details.
	- **chapterEdit** - Where the user can edit a chapter's details.
3. **Settings** (previously `settings` + `settingsCtrl`) - Allows the users to change several of the app's settings. Still in development.

### Services

**Located in:** [src/app/services](./src/app/services)

1. **librarian** - A service provided in the app root. It's responsible for getting a story's or a library's data and posting changes to the JSON file containing the library information (data/stories.JSON).

### Production Scripts

The project contains two production-ready scripts:

1. **server.js** - Contains a basic Express server with compression, in order to serve files in a production environment.
2. **env-config.js** - Contains a script to find and replace environment variables (in src/environments) with configured environment variables from the hosting environment. This script is an optional adjustment - feel free to delete it if you don't need it.

## Dependencies

### Gulp

The site uses several tools to maximise compatibility:

1. **Gulp** - Gulp enables running tasks automatically. You can read more on the [Gulp website](https://gulpjs.com). Gulp is a Node.js tool, so it requires installing Node.
2. **Gulp-Postcss** with **Autoprefixer** Plugin - A Gulp plugin which adds the necessary browser prefixes to the CSS file. For more info check the [Gulp-postcss](https://www.npmjs.com/package/gulp-postcss) page and the [Autoprefixer](https://www.npmjs.com/package/autoprefixer) page on NPM.
3. **Rollup** (with @rollup/stream) - A module bundler for JS. Rollup bundles up the main module (AppModule) and converts it from TypeScript to ES6. For more info, check the [Rollup repo](https://github.com/rollup/rollup) and Gulp's [Rollup + Gulp recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/rollup-with-rollup-stream.md).
4. **Gulp-Babel** - A Gulp plugin for the transpiler Babel. Converts ES6 output to the highly supported ES5 (currently isn't used). For more info check the plugin's [GitHub](https://github.com/babel/gulp-babel) repository.
5. **Gulp-Uglify** - A Gulp plugin which minimises the single ES5 file (Babel's output). For more info check the [Gulp-uglify](https://www.npmjs.com/package/gulp-uglify) page on NPM.
6. **Gulp-Sourcemaps** - A Gulp plugin utilizing the source maps tool. For more info check the [Gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) page on NPM.
7. **Gulp-Rename** - A gulp plugin used to rename files. Used to rename the main module JS and to change the directory name of all HTML files. For more info check the [Gulp-rename](https://www.npmjs.com/package/gulp-rename) page on NPM.
8. **Gulp-replace** - A string replace plugin for Gulp. Used to change the templateUrls in the final JS file. For more info, check the [Gulp-replace](https://www.npmjs.com/package/gulp-replace) page on NPM.

### Angular

1. **@angular/animations** - Angular's animations library.
2. **@angular/common** - Angular's commonly needed services, pipes and directives.
3. **@angular/compiler** - Angular's template compiler.
4. **@angular/compiler-cli** - Command-line interface to invoke Angular's compiler.
5. **@angular/core** - Critical runtime parts of the Angular framework.
6. **@angular/forms** - Support for template-driven and reactive forms.
7. **@angular/platform-browser** - Everything DOM and browser-related.
8. **@angular/platform-browser-dynamic** - Providers and methods for compiling and running the app.
9. **@angular/router** - Angular's router module.
10. **rxjs** - Contains an implementation of observables, which many Angular APIs use.
11. **typescript** - TypeScript language server, which Angular uses.
12. **zone.js** - Implementation of zones for JavaScript (used by Angular).
13. **core-js** - Modular standard library for JavaScript. Contains polyfills. For more information, check the [GitHub repo](https://github.com/zloirock/core-js).

For more information about Angular's required NPM packages, check the [Angular docs](https://angular.io/guide/npm-packages).

### Testing Dependencies

This project's tests are run using the Jasmine framework and the Karma runner. Thus, testing requires several packages:

1. **Jasmine** - An open-source behaviour-driven testing framework. For more information, check Jasmine's [official site](https://jasmine.github.io). Included packages:
    - **jasmine-core**
    - **jasmine-spec-reporter**
    - **@types/jasmine** - A typed version, required in order to write TypeScript tests.
2. **Karma** - An open-source test-runner, used to run the tests on various devices with a test server. For more information, check Karma's [official site](https://karma-runner.github.io/latest/index.html). Included packages:
    - **karma**
    - **karma-jasmine** - A Karma adapter for the Jasmine framework. [Project repo.](https://github.com/karma-runner/karma-jasmine)
    - **karma-jasmine-html-reporter** - A reporter that shows test results in HTML. [NPM page.](https://www.npmjs.com/package/karma-jasmine-html-reporter).
    - **karma-chrome-launcher** - A launcher for Chrome, Chrome Canary and Chromuim. [Project repo.](https://github.com/karma-runner/karma-chrome-launcher).
    - **karma-coverage** - Code coverage generator. [Project repo.](https://github.com/karma-runner/karma-coverage)
    - **karma-coverage-istanbul-reporter** - Code coverage generator reporter. [NPM page.](https://www.npmjs.com/package/karma-coverage-istanbul-reporter)
    - **karma-sourcemap-loader** - A preprocessor that loads existing source maps. [NPM page.](https://www.npmjs.com/package/karma-sourcemap-loader)
    - **karma-rollup-preprocessor** - A rollup preprocessor for karma, used to bundle up the tests. [NPM page.](https://www.npmjs.com/package/karma-rollup-preprocessor)
3. **Cypress** - An open-source test runner, used primarily for e2e and integration tests. For more information, check their [official documentation](https://docs.cypress.io).

### Production Dependencies

1. **Express** - This project uses Express in order to run a basic server in deployment. This server is used to send the static files and script to the user. For more information, check the [Express website](https://expressjs.com).
2. **Compression** - A Node extension used to compress production files when sending them from the Express server to the client. For more information, check the [compression NPM page](https://www.npmjs.com/package/compression).
2. **dotenv** - A Node extension for accessing environment variables. Used by the frontend while in production mode. For more information, check the [dotenv NPM page](https://www.npmjs.com/package/dotenv).

## Testing

### Writing Tests

Tests are written in TypeScript and each component's tests are located in the same directory as the component. Test files' names follow this format: `<component_name>.spec.ts`. This format is the way tests are picked up by the main testing file, and so it's important to keep to it.

End-to-end tests are also written in TypeScript. All end-to-end tests are located in [e2e/src](./e2e/src), and are named in a similar manner to regular specs files: `<something_to_test>.spec.ts`. The Cypress config is in the root (in `cypress.json`), but the plugins and support files are in the [e2e](./e2e) folder as well.

### Running Tests

Running tests is done through the dedicated Gulp task. All you need to do is run `gulp test` in the terminal; this will start Karma and trigger Rollup's compilation of tests and project files.

Running end-to-end tests is done through an npm script. Running `npm run e2e` in the terminal will bundle up assets for testing, fire up the development server and run Cypress.

## Hosting

If you want to clone and host your own version, you can do so by using the following guide (the following commands are for Heroku, but they can be adjusted depending on your host):

1. Create a Heroku account (skip this step if you already have an account).
2. Install the Heroku command line interface.
3. In your Terminal, enter `heroku login`. This triggers logging in via the CLI.
4. Enter `heroku create <APP_NAME>` (with your own app name). If successful, Heroku returns the live version's URL (will be referred to as <LIVE_URL>) and the Git repo link (will be referred to as <GIT_URL>).
5. Add your environment variables (if there are any).
6. Make sure you're in the top directory (FSND-capstone). In your terminal, enter `git remote add heroku-client <GIT_URL>`.
7. Enter `git push heroku-client master`. This triggers the app build. If successful, you'll get a 'Verifying deploy... done.' message.
8. All done! Now you can visit your <GIT_URL> to see the live app.

## Known Issues

There are no current issues at the time.
