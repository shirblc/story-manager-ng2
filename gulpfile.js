// node
const path = require('path');
const fs = require("fs");
const { exec } = require("child_process");
// gulp
const gulp = require("gulp");
const less = require('gulp-less');
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const postcss = require("gulp-postcss");
// rollup
const rollupStream = require("@rollup/stream");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve").nodeResolve;
const typescript = require("@rollup/plugin-typescript");
const terser = require('@rollup/plugin-terser');
// everything else
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const Server = require('karma').Server;
const parseConfig = require('karma').config.parseConfig;
const setProductionEnv = require("./processor").setProductionEnv;
const updateComponentTemplateUrl = require("./processor").updateComponentTemplateUrl;
let bs;


// LOCAL DEVELOPMENT TASKS
// ===============================================
//copies the html to the disribution folder
function copyHtml()
{
	return gulp
		.src("src/app/**/*.html")
		.pipe(rename({dirname:""}))
		.pipe(gulp.dest("./localdev/app"));
}

//copies the index html to the disribution folder
function copyIndex()
{
	return gulp
		.src("index.html")
		.pipe(gulp.dest("./localdev"));
}

//copies the images folder to the distribution folder
function copyImgs()
{
	return gulp
		.src("src/assets/img/*", { encoding: false })
		.pipe(gulp.dest("localdev/assets/img"));
}

//converts the less files to css and adds prefixes with Autoprefixer
function styles()
{
	return gulp
		.src("src/styles/*.less")
		.pipe(less())
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest("./localdev/css"));
}

//copies the fonts to the distribution folder
function copyFonts()
{
	return gulp
		.src("src/css/*.ttf")
		.pipe(gulp.dest("./localdev/css"));
}

//deals with transforming the scripts while in development mode
function scripts()
{
	const options = {
		input: 'src/main.ts',
		output: { sourcemap: 'inline' },
		plugins: [
			updateComponentTemplateUrl(),
			typescript({ exclude: ['**/*.spec.ts', 'e2e/**/*'] }),
			nodeResolve({
				extensions: ['.js', '.ts']
			}),
			commonjs({
				extensions: ['.js', '.ts'],
				transformMixedEsModules: true
			})
    	]
   	};

	return rollupStream(options)
      .pipe(source("src/main.ts"))
      .pipe(buffer())
			.pipe(rename("app.bundle.js"))
      .pipe(gulp.dest("./localdev"));
}

function copyServiceWorker()
{
	return gulp
		.src("src/sw.js")
		.pipe(gulp.dest("./localdev"));
}

//watch files for changes and then run the appropriate tasks
async function watch()
{
	gulp.watch("src/app/**/*.html", copyHtml)
	gulp.watch("index.html", copyIndex);
	gulp.watch("src/assets/img/*", copyImgs);
	gulp.watch("src/styles/*.less", styles);
	gulp.watch('src/css/*.ttf', copyFonts);
	gulp.watch("src/**/*.ts", scripts);
	gulp.watch("src/sw.js", copyServiceWorker);
}

//prepare for local development
gulp.task('localDev', gulp.parallel(
	copyHtml,
	copyIndex,
	copyImgs,
	styles,
	copyFonts,
	scripts,
	copyServiceWorker,
));

// PRODUCTION TASKS
// ===============================================
//copies the html to the disribution folder
function copyHtmlDist()
{
	return gulp
		.src("src/app/**/*.html")
		.pipe(rename({dirname:""}))
		.pipe(gulp.dest("./dist/app"));
}

//copies the index html to the disribution folder
function copyIndexDist()
{
	return gulp
		.src("index.html")
		.pipe(replace(/src="app.bundle.js"/, () => {
			let newString = `src="app.bundle.min.js"`
			return newString;
		}))
		.pipe(gulp.dest("./dist"));
}

//copies the images folder to the distribution folder
function copyImgsDist()
{
	return gulp
		.src("src/assets/img/*", { encoding: false })
		.pipe(gulp.dest("dist/assets/img"));
}

//converts the less files to css and adds prefixes with Autoprefixer
function stylesDist()
{
	return gulp
		.src("src/styles/*.less")
		.pipe(less())
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest("./dist/css"));
}

//copies the fonts to the distribution folder
function copyFontsDist()
{
	return gulp
		.src("src/css/*.ttf")
		.pipe(gulp.dest("./dist/css"));
}

//deals with transforming and bundling the scripts while in production mode
function scriptsDist()
{
	const options = {
		input: 'src/main.ts',
		output: {
      file: "app.bundle.min.js",
      sourcemap: 'hidden',
      plugins: [terser()]
    },
		plugins: [
			updateComponentTemplateUrl(),
			setProductionEnv(),
			typescript({ exclude: ['**/*.spec.ts', 'e2e/**/*'] }),
			nodeResolve({
				extensions: ['.js', '.ts']
			}),
			commonjs({
				extensions: ['.js', '.ts'],
				transformMixedEsModules: true
			})
    	]
   	};

	return rollupStream(options)
      .pipe(source("src/main.ts"))
      .pipe(buffer())
			.pipe(rename("app.bundle.min.js"))
      .pipe(gulp.dest("./dist"));
}

function copyServiceWorkerDist()
{
	return gulp
		.src("src/sw.js")
		.pipe(gulp.dest("./dist"));
}

//prepare for distribution
gulp.task('dist', gulp.parallel(
	copyHtmlDist,
	copyIndexDist,
	copyImgsDist,
	stylesDist,
	copyFontsDist,
	scriptsDist,
	copyServiceWorkerDist,
));

// TESTING TASKS
// ===============================================
// import all the tests to main file
// credit for this goes to @hackerhat
// https://github.com/facebook/create-react-app/issues/517#issuecomment-417943099
function setupTests() {
	return gulp.src('src/tests.ts')
	.pipe(replace(/\/\/ test-placeholder/, (match) => {
		let newString = '';

		function readDirectory(directory) {
	    fs.readdirSync(directory).forEach((file) => {
	      const fullPath = path.resolve(directory, file);
				const regularExpression = /\.spec\.ts$/;

	      if (fs.statSync(fullPath).isDirectory()) {
	        readDirectory(fullPath);
	      }

	      if (!regularExpression.test(fullPath)) return;

				let hugIndex = fullPath.indexOf('app');
				let newPath = './' + fullPath.substring(hugIndex);
	      newString += `import "${newPath}";
				`;
	    });
	  }

		readDirectory(path.resolve(__dirname, 'src'));

			return newString;
		}))
	.pipe(rename("tests.specs.ts"))
	.pipe(gulp.dest('src/'))
}

// automatic testing in whatever browser is defined in the Karma config file
function unitTest()
{
	return new Server(parseConfig(__dirname + '/karma.conf.js')).start();
}

gulp.task('test', gulp.series(
	setupTests,
	unitTest
))

// boot up the server for e2e testing - headless
async function e2eServe() {
	bs = browserSync.init({
		server: {
			baseDir: "./localdev"
		},
		single: true,
		open: false,
		ui: false
	});

	await bs;
}

// run e2e tests
async function e2e() {
	// compile
	copyHtml();
	copyIndex();
	copyImgs();
	styles();
	await scripts();

	// serve
	e2eServe();

	// run cypress
	await exec('npm run cypress', (error, stdout, stderr) => {
		if (error) {
        console.log(`error: ${error.message}`);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);

		if(bs) {
			bs.cleanup();
		}
	})
}

//boot up the server
gulp.task("serve", function() {
	browserSync.init({
		server: {
			baseDir: "./localdev"
		},
		single: true
	});
});

//exports for gulp to recognise them as tasks
exports.copyHtml = copyHtml;
exports.copyIndex = copyIndex;
exports.copyImgs = copyImgs;
exports.styles = styles;
exports.scripts = scripts;
exports.scriptsDist = scriptsDist;
exports.dist = gulp.parallel(
	copyHtmlDist,
	copyIndexDist,
	copyImgsDist,
	stylesDist,
	copyFontsDist,
	scriptsDist,
	copyServiceWorkerDist,
);
exports.unitTest = unitTest;
exports.watch = watch;
exports.e2e = e2e;
