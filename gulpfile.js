const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
var del = require('del');

// Compiles SCSS To CSS
gulp.task(
	'style',
	gulp.series(() => {
		return gulp
			.src('src/scss/**/*.scss')
			.pipe(
				sass({
					outputStyle: 'compressed'
				}).on('error', sass.logError)
			)
			.pipe(
				autoprefixer({
					browsers: ['last 2 versions']
				})
			)
			.pipe(gulp.dest('./public/css'))
			.pipe(browserSync.stream());
	})
);

// Move fontawesome webfont files
gulp.task(
    'vendor',
    gulp.series(() => {
		console.log("Moving fontawesome webfonts");
        return gulp
            .src([
                './node_modules/@fortawesome/fontawesome-free/webfonts/**',    
            ])
            .pipe(gulp.dest('./public/vendor/fontawesome/webfonts'))
    })
);

// Move fontawesome css files
gulp.task(
    'fa-css',
    gulp.series(() => {
		console.log("Moving fontawesome css");
        return gulp
            .src([
                './node_modules/@fortawesome/fontawesome-free/css/all.css'
            ])
            .pipe(gulp.dest('./public/vendor/fontawesome/css'))
    })
);

// Move bootstrap files
gulp.task(
	'bootstrap',
	gulp.series(() => {
		console.log("Moving bootstrap files");
		return gulp
				.src([
					'./node_modules/bootstrap/dist/css/bootstrap.min.css',
					'./node_modules/bootstrap/dist/js/bootstrap.js',
					'./node_modules/jquery/dist/jquery.min.js',
					'./node_modules/popper.js/dist/popper.min.js',

				])
				.pipe(gulp.dest([
						'./public/vendor/bootstrap'
				]))
	})
);



// Browser-sync to get live reload and sync with mobile devices
gulp.task(
	'browser-sync',
	gulp.series(function() {
		browserSync.init({
			server: './public',
			notify: false,
			open: true //change this to true if you want the browser to open automatically
		});
	})
);

// Use Browser Sync With Any Type Of Backend
gulp.task(
	'browser-sync-proxy',
	gulp.series(function() {
		// THIS IS FOR SITUATIONS WHEN YOU HAVE ANOTHER SERVER RUNNING
		browserSync.init({
			proxy: {
				target: 'http://localhost:3333/', // can be [virtual host, sub-directory, localhost with port]
				ws: true // enables websockets
			}
			// serveStatic: ['.', './public']
		});
	})
);

// Minimise Your Images
gulp.task(
	'imagemin',
	gulp.series(function minizingImages() {
		return gulp
			.src('src/img/**/*')
			.pipe(
				imagemin([
					imagemin.gifsicle({ interlaced: true }),
					imagemin.jpegtran({ progressive: true }),
					imagemin.optipng({ optimizationLevel: 5 }),
					imagemin.svgo({
						plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
					})
				])
			)
			.pipe(gulp.dest('./public/img'));
	})
);

// This is your Default Gulp task
gulp.task(
	'default',
	gulp.parallel([
		gulp.series([			
            'style',
            'vendor',
            'fa-css',
			function runningWatch() {
				gulp.watch('./src/scss/**/*', gulp.parallel('style'));				
				gulp.watch(['./public/**/*', './public/*']).on('change', reload);
			}
		]),
		gulp.series(['browser-sync'])
	])
);

// Delete Your Temp Files
gulp.task(
	'cleanTemp',
	gulp.series(() => {
		return del([
			'./temp'

			//   '!public/img/**/*'
		]);
	})
);