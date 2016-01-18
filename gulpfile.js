var gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    CONFIG = require('./.gulpfilec');

gulp.task('clean', function (done) {
    var del = require('del');
    del(CONFIG.PATHS.clean, done);
});

gulp.task('uglify', function () {

    var uglify = require('gulp-uglify');
    var jsResult = gulp.src(CONFIG.PATHS.src.js)
        .pipe(uglify())
        .pipe(concat('script.js'));

    return jsResult.pipe(gulp.dest(CONFIG.PATHS.dist.js));
});

gulp.task('lesstocss', function () {

    var less = require('gulp-less');

    var lessCssResult = gulp.src(CONFIG.PATHS.src.less)
        .pipe(concat('style.less'))
        .pipe(gulp.dest(CONFIG.PATHS.dist.less))
        .pipe(less())
        .pipe(gulp.dest(CONFIG.PATHS.dist.css))
        .pipe(less({
            compress: true
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(CONFIG.PATHS.dist.css));

    return lessCssResult;
});

gulp.task('html', function () {
    return gulp.src(CONFIG.PATHS.src.html).pipe(gulp.dest(CONFIG.APP_DIST));
});

gulp.task('libs', function () {
    return gulp.src(CONFIG.PATHS.lib).pipe(gulp.dest(CONFIG.PATHS.dist.lib));
});

gulp.task('build', ['libs', 'html', 'uglify', 'lesstocss']);

gulp.task('start', ['libs', 'html', 'uglify', 'lesstocss'], function () {
    var http = require('http'),
        connect = require('connect'),
        serveStatic = require('serve-static'),
        open = require('open'),
        browserSync = require('browser-sync');

    var port = 9000, app;

    gulp.watch(CONFIG.PATHS.src.html, ['html']);
    gulp.watch(CONFIG.PATHS.src.js, ['uglify']);
    gulp.watch(CONFIG.PATHS.src.less, ['lesstocss']);

    /*app = connect().use(serveStatic(__dirname + CONFIG.APP_BASE + CONFIG.APP_DIST));  // serve everything that is static
    http.createServer(app).listen(CONFIG.PORT, function () {
        open(CONFIG.APP_HOST + ':' + CONFIG.PORT);
    });*/

    browserSync({
        port: CONFIG.PORT,
        files: ['dist/index.html', '**/*.js', '**/*.css'],
        injectChanges: true,
        logFileChanges: false,
        logLevel: 'silent',
        notify: true,
        reloadDelay: 0,
        server: {
            baseDir: ['./dist/']
        }
    });

});
