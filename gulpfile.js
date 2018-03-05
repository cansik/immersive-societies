let gulp = require('gulp');
let uglify = require('gulp-uglify-es').default;
let concat = require('gulp-concat-util');
let watch = require('gulp-watch');

gulp.task('build', function () {
    gulp.src("./src/**/*")
        .pipe(uglify())
        .pipe(concat('immersive.min.js', {sep: ''}))
        .pipe(gulp.dest('./resources/js/'));
});

gulp.task('develop', function () {
    gulp.src("./src/**/*")
        .pipe(concat('immersive.min.js', {sep: '\n\n'}))
        .pipe(gulp.dest('./resources/js/'));
});

gulp.task('watch', function () {
    watch('src/*', function () {
        gulp.start('develop')
    })
});