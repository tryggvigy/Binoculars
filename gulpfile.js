/*jshint ignore: start*/

// PATHS
var basePaths = {
    src: 'src/',
    dest: 'dist/',
    test: 'test/'
};
var paths = {
    scripts: {
        src: basePaths.src + '**/*.js',
        dest: basePaths.dest
    },
    tests: {
      src: basePaths.test + '**/*.test.js',
      dest: basePaths.test
    }
};

// FIRES ON FILE CHANGE.
var changeEvent = function(evt) {
    gutil.log('\n\nFile', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type)+', running tasks...');
};

var gulp = require('gulp');
var es = require('event-stream');
var gutil = require('gulp-util');

//Searches for gulp plugins starting with [gulp] or [gulp-] in package.json and loads them into this obj.
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// Allows gulp --dev to be run for a more verbose output
var isProduction = true;

if(gutil.env.dev === true) {
    isProduction = false;
}

//#########################################
//################ TASKS ##################
//#########################################

/********** Private Tasks *************/

// Lint JS
gulp.task('hint', function() { //jshint giving too many false positives to be used...
  gulp.src([paths.scripts.src])
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// Concat JS
gulp.task('concat', plugins.shell.task([
  'node_modules/.bin/smash src/binoculars.js > dist/binoculars.js'
]));

gulp.task('test', function(){ //TODO could growl the result of this task...
  gulp.src(paths.tests.src)
  .pipe(plugins.concat('test-generated.js'))
  .pipe(gulp.dest(paths.tests.dest))
  .pipe(plugins.shell(['make test-browser']));
});

// Uglify JS
gulp.task('uglify', function(){
  gulp.src(paths.scripts.dest + "binoculars.js")
    .pipe(plugins.uglify())
    .pipe(plugins.rename("binoculars.min.js"))
    .pipe(gulp.dest(paths.scripts.dest));
});

// Test
gulp.task('test-watch', plugins.shell.task([
  'make test'
]));

// Watch Our Files
gulp.task('watch', function() {

    gulp.watch([paths.scripts.src]).on('change', function(evt) {
        changeEvent(evt);
    });

    gulp.watch(paths.scripts.src, ['concat', 'test']);
    gulp.watch(paths.tests.src, ['test']);
});


/********** Public Tasks *************/

// Build
gulp.task('build', ['concat', 'test']);

// Dist
gulp.task('dist', ['build', 'concat', 'uglify', 'test']);


// Default
gulp.task('default', ['concat', 'test', 'watch']);

/*jshint ignore: end*/
