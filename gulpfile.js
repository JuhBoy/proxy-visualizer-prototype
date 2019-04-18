var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var tslint = require("gulp-tslint");

const transcompile = (cb) => {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
}

const lint = (cb) => {
    return gulp.src('./src/**/**.ts')
        .pipe(tslint({ formatter: "verbose" }))
        .pipe(tslint.report());
}

exports.transcompile = transcompile;
exports.lint = lint;
exports.default = gulp.series(transcompile);
