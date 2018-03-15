var gulp = require('gulp');
var cssBase64 = require('gulp-css-base64');

gulp.task('css-img-base64', function () {
    return gulp.src('./template.css')
        .pipe(cssBase64())
        .pipe(gulp.dest('./dist'));
});