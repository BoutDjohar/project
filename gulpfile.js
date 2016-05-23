var gulp = require('gulp'),
    path = require('path'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    superstatic = require('superstatic'),
    preprocess = require('gulp-preprocess'),
    config = require('./gulp.config')();


gulp.task('build-clean', function () {
    var clean = require('gulp-clean');
    return gulp.src(config.dist, {read: false})
        .pipe(clean());
});


gulp.task('build-libs', function () {
    config.lib.forEach(function (lib, index, array) {
        gulp.src(lib.src)
            .pipe(
                gulp.dest(
                    path.join(config.js.output, lib.dist)
                )
            )
    });
    return true;
});

gulp.task('build-scripts', function () {
    var uglify = require('gulp-uglify');
    var gutil = require('gulp-util');

    var jsResult = gulp.src(config.js.input)
        .pipe(concat('script.js'))
        .pipe(gulp.dest(config.js.output))
        .pipe(uglify())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest(config.js.output))
        .on('error', gutil.log);

    return jsResult;

});

gulp.task('build-styles', function () {
    var sass = require('gulp-sass');

    var sassCssResult = gulp.src(config.sass.input)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(config.sass.output))
        .pipe(
            sass({
                outputStyle: 'compressed',
                compress: true
            }).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.sass.output));

    return sassCssResult;
});

gulp.task('build-img', function () {
    
    imgResult = gulp.src(config.img.input).pipe(gulp.dest(config.img.output));
    return imgResult;

});

gulp.task('build', function (callback) {
    runSequence('build-clean',
        ['build-img', 'build-libs', 'build-scripts', 'build-styles'],
        callback);
});

gulp.task('serve', ['build'], function () {

    gulp.watch([config.img.watch], ['build-img']);
    gulp.watch([config.js.watch], ['build-scripts']);
    gulp.watch([config.sass.watch], ['build-styles']);

    browserSync({
        port: 6600,
        files: ['./dist/**/*.js', './dist/**/*.css'],
        injectChanges: true,
        logFileChanges: false,
        logLevel: 'silent',
        notify: true,
        reloadDelay: 0,
        server: {
            baseDir: ['./']
        }
    });
});

gulp.task('default', ['serve']);


gulp.task('build-prod', function () {

    var path = require('path');

    gulp
        .src(['!build/', '!node_modules/', 'server/**/*'])
        .pipe(gulp.dest(path.join(PATHS.dist.build, 'server/')));

    gulp
        .src(['!build/', '!node_modules/', 'app/**/*', '!app/**/*.ts', '!app/**/*.js.map'])
        .pipe(gulp.dest(path.join(PATHS.dist.build, 'app/')));

    gulp
        .src(['!build/', '!node_modules/', 'src/**/*', '!src/sass/**/*'])
        .pipe(gulp.dest(path.join(PATHS.dist.build, 'src/')));


    PATHS.lib.forEach(function (lib, index, array) {
        gulp.src(lib.src)
            .pipe(
                gulp.dest(
                    path.join(PATHS.dist.lib, lib.dist)
                )
            )
    });

    gulp.src('index.src.html')
        .pipe(preprocess({
            context: {
                LIB_PATH: config.build.prod.LIB_PATH,
                BOWER_PATH: config.build.prod.BOWER_PATH,
                HREF: config.build.prod.HREF,
                BASE_URL: config.build.prod.BASE_URL,
                DEBUG: true
            }
        })) //To set environment variables in-line
        .pipe(rename('index.html'))
        .pipe(gulp.dest(PATHS.dist.build));

});


var PATHS = {
    dist: {
        build: 'build/',
        lib: 'build/lib/'
    },
    lib: [
        {
            src: 'node_modules/font-awesome/css/**',
            dist: 'font-awesome/css/'
        }, {
            src: 'node_modules/font-awesome/fonts/**',
            dist: 'font-awesome/fonts/'
        }, {
            src: 'node_modules/jquery/dist/jquery.min.js',
            dist: 'jquery/dist'
        }, {
            src: 'node_modules/angular2/bundles/angular2-polyfills.js',
            dist: 'angular2/bundles'
        }, {
            src: 'node_modules/angular2/bundles/angular2.dev.js',
            dist: 'angular2/bundles'
        }, {
            src: 'node_modules/angular2/bundles/router.dev.js',
            dist: 'angular2/bundles'
        }, {
            src: 'node_modules/angular2/bundles/http.dev.js',
            dist: 'angular2/bundles'
        }, {
            src: 'node_modules/systemjs/dist/system.src.js',
            dist: 'systemjs/dist'
        }, {
            src: 'node_modules/rxjs/bundles/Rx.js',
            dist: 'rxjs/bundles'
        }, {
            src: 'node_modules/jquery/dist/jquery.js',
            dist: 'jquery/dist'
        }, {
            src: 'node_modules/jquery-ui/jquery-ui.js',
            dist: 'jquery-ui'
        }, {
            src: 'node_modules/jquery-ui/themes/smoothness/**/*',
            dist: 'jquery-ui/themes/smoothness'
        }, {
            src: 'node_modules/bootstrap/dist/**/*',
            dist: 'bootstrap/dist'
        }, {
            src: 'node_modules/d3/d3.min.js',
            dist: 'd3'
        }, {
            src: 'src/js/c3-0.4.10/c3.min.css',
            dist: 'src/js/c3-0.4.10/'
        }, {
            src: 'src/js/c3-0.4.10/c3.js',
            dist: 'src/js/c3-0.4.10/'
        }
    ]
};
