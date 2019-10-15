var gulp = require('gulp');
var base64 = require('gulp-base64');

gulp.task('css-base64', function () {
    gulp.src('./template-1.css')
        .pipe(base64())
        .pipe(gulp.dest('./dist'));

    gulp.src('./template-2.css')
        .pipe(base64())
        .pipe(gulp.dest('./dist'));
});