var gulp = require('gulp'),
    path = require('path'),
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
        .pipe(concat('script.js'))
        .pipe(gulp.dest(CONFIG.PATHS.dist.js))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(CONFIG.PATHS.dist.js));

    return jsResult;
});

gulp.task('lesstocss', function () {
    var less = require('gulp-less');

    var lessCssResult = gulp.src(CONFIG.PATHS.src.less.index)
        .pipe(less())
        .pipe(concat('style.less.css'))
        .pipe(gulp.dest(CONFIG.PATHS.dist.css))
        .pipe(less({
            compress: true
        }))
        .pipe(rename({suffix: '.lass.min'}))
        .pipe(gulp.dest(CONFIG.PATHS.dist.css));

    return lessCssResult;
});


gulp.task('sasstocss', function () {
    var sass = require('gulp-sass');

    var sassCssResult = gulp.src(CONFIG.PATHS.src.sass.index)
        .pipe(sass())
        .pipe(concat('style.sass.css'))
        .pipe(gulp.dest(CONFIG.PATHS.dist.css))
        .pipe(sass({
            compress: true
        }))
        .pipe(rename({suffix: '.sass.min'}))
        .pipe(gulp.dest(CONFIG.PATHS.dist.css));

    return sassCssResult;
});

gulp.task('html', function () {
    return gulp.src(CONFIG.PATHS.src.html).pipe(gulp.dest(CONFIG.APP_DIST));
});

gulp.task('img', function () {
    return gulp.src(CONFIG.PATHS.src.img).pipe(gulp.dest(CONFIG.APP_DIST));
});

gulp.task('libs', function () {
    CONFIG.PATHS.lib.forEach(function (lib, index, array) {
        gulp.src(lib.src)
            .pipe(
                gulp.dest(
                    path.join(CONFIG.PATHS.dist.lib, lib.dist)
                )
            )
    });
    return true; //gulp.src(CONFIG.PATHS.lib).pipe(gulp.dest(CONFIG.PATHS.dist.lib));
});

gulp.task('build', ['libs', 'html', 'uglify', 'lesstocss', 'sasstocss', 'img']);

gulp.task('start', ['libs', 'html', 'uglify', 'lesstocss', 'sasstocss', 'img'], function () {
    var http = require('http'),
        connect = require('connect'),
        serveStatic = require('serve-static'),
        open = require('open'),
        browserSync = require('browser-sync');

    var port = 9000, app;

    gulp.watch(CONFIG.PATHS.src.html, ['html']);
    gulp.watch(CONFIG.PATHS.src.js, ['uglify']);
    gulp.watch(CONFIG.PATHS.src.less.files, ['lesstocss']);
    gulp.watch(CONFIG.PATHS.src.less.files, ['sasstocss']);
    gulp.watch(CONFIG.PATHS.src.img, ['img']);

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

gulp.task('default', ['build']);