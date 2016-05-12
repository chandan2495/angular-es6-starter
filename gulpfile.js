var gulp          = require('gulp'); //https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
var notify        = require('gulp-notify'); // to send messages to Windows using the node-notifier module. https://github.com/mikaelbr/gulp-notify
var source        = require('vinyl-source-stream'); //Use conventional text streams at the start of your gulp or vinyl pipelines https://github.com/hughsk/vinyl-source-stream
var browserify    = require('browserify'); //http://browserify.org/ (bundling up all of your dependencies)
var babelify      = require('babelify'); //Browserify transform for Babel(https://babeljs.io/) (url: https://github.com/babel/babelify)
var ngAnnotate    = require('browserify-ngannotate'); //uses ng-annotate to add dependency injection annotations to your AngularJS source code https://github.com/omsmith/browserify-ngannotate
var browserSync   = require('browser-sync').create(); //https://www.browsersync.io/ synchornised browser testing
var rename        = require('gulp-rename'); //gulp-rename is a gulp plugin to rename files easily. https://www.npmjs.com/package/gulp-rename
var templateCache = require('gulp-angular-templatecache');  //https://www.npmjs.com/package/gulp-angular-templatecache Concatenates and registers AngularJS templates in the $templateCache.    
var uglify        = require('gulp-uglify'); //Minify files with UglifyJS. https://www.npmjs.com/package/gulp-uglify
var merge         = require('merge-stream'); //Create a stream that emits events from multiple other streams https://www.npmjs.com/package/merge-stream

// Where our files are located
var jsFiles   = "src/js/**/*.js";
var viewFiles = "src/js/**/*.html";

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};


gulp.task('browserify', ['views'], function() { // bundle all dependencies of app.js
  return browserify('./src/js/app.js')
      .transform(babelify, {presets: ["es2015"]})
      .transform(ngAnnotate)  // put annotation for each file
      .bundle()
      .on('error', interceptErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('main.js'))  // save dependencies in main.js
      // Start piping stream to tasks!
      .pipe(gulp.dest('./build/')); // copy to build folder
});

gulp.task('html', function() {
  return gulp.src("src/index.html")
      .on('error', interceptErrors)
      .pipe(gulp.dest('./build/'));
});

gulp.task('views', function() {   // concatenate angularjs templates in one file
  return gulp.src(viewFiles)
      .pipe(templateCache({
        standalone: true
      }))
      .on('error', interceptErrors)
      .pipe(rename("app.templates.js"))
      .pipe(gulp.dest('./src/js/config/')); // copy to config folder
});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('build', ['html', 'browserify'], function() {
  var html = gulp.src("build/index.html")
                 .pipe(gulp.dest('./dist/'));

  var js = gulp.src("build/main.js")
               .pipe(uglify())
               .pipe(gulp.dest('./dist/'));

  return merge(html,js);
});

gulp.task('default', ['html', 'browserify'], function() {

  browserSync.init(['./build/**/**.**'], {
    server: "./build",
    port: 4000,
    notify: false,
    ui: {
      port: 4001
    }
  });

  gulp.watch("src/index.html", ['html']);
  gulp.watch(viewFiles, ['views']);
  gulp.watch(jsFiles, ['browserify']);
});
