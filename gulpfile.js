let gulp = require('gulp');
let uglify = require('gulp-uglify-es').default;
let concat = require('gulp-concat-util');
let watch = require('gulp-watch');

let sass = require('gulp-sass');
let cleanCSS = require('gulp-clean-css');
let rename = require("gulp-rename");
let browserSync = require('browser-sync').create();

let useref = require('gulp-useref');
let gulpIf = require('gulp-if');

let cssnano = require('gulp-cssnano');
let imagemin = require('gulp-imagemin');
let cache = require('gulp-cache');

let del = require('del');

let data = require('gulp-data');
let nunjucksRender = require('gulp-nunjucks-render');

let ftp = require('vinyl-ftp');
let gutil = require('gulp-util');
let minimist = require('minimist');
let args = minimist(process.argv.slice(2));

gulp.task('images', function () {
    return gulp.src('./app/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('./dist/img'))
});

// Compile SCSS
gulp.task('css:compile', function () {
    return gulp.src('./app/scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
    return gulp.src([
        './dist/css/*.css',
        '!./dist/css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// USER REF
gulp.task('useref', function () {
    return gulp.src('app/*.html')
         // nunjucks
        .pipe(data(function() {
            return require('./app/data.json')
        }))
        .pipe(nunjucksRender({
            path: ['./app/templates']
        }))
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

// VENDOR
gulp.task('vendor', function () {
    return gulp.src(['./app/vendor/**/*']).pipe(gulp.dest('./dist/vendor'));
});

// CLEAN
gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('build', ['clean:dist', 'useref', 'images', 'vendor']);

gulp.task('watch', function () {
    watch('./app/*', function () {
        gulp.start('build')
    })
});

gulp.task('deploy', function() {
    let remotePath = '/immersive-societies/';
    let conn = ftp.create({
        host: 'easyguet.ch',
        user: args.user,
        password: args.password,
        log: gutil.log
    });
    conn.rmdir(remotePath, function () {
        gulp.src(['./dist/**/*'])
            .pipe(conn.dest(remotePath));
    });
});