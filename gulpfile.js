var gulp = require('gulp');
var cssBase64 = require('gulp-css-base64');

gulp.task('css-img-base64', function () {
    gulp.src('./template-1.css')
        .pipe(cssBase64())
        .pipe(gulp.dest('./dist'));

    gulp.src('./template-2.css')
        .pipe(cssBase64())
        .pipe(gulp.dest('./dist'));

    gulp.src('./template-3.css')
        .pipe(cssBase64())
        .pipe(gulp.dest('./dist'));
});