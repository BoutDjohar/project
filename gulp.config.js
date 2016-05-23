module.exports = function () {
    var config = {
        dist: 'dist/',
        src: 'src/',
        sass: {
            src: './src/sass/',
            input: './src/sass/style.scss',
            output: './dist/css',
            watch: ['./src/sass/**/*.sass', './src/sass/**/*.scss']
        },
        js: {
            src: './src/js/',
            input: './src/js/**/*.js',
            output: './dist/js',
            watch: ['./src/js/**/*.js']
        },
        img: {
            src: './src/img/',
            input: './src/img/**/*.*',
            output: './dist/img/',
            watch: ['./src/img/*']
        },
        lib: [
            {
                src: 'bower_components/jquery/dist/jquery.js',
                dist: 'jquery'
            }
        ]
    };
    return config;
}