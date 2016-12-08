var gulp = require('gulp');
var less = require('less');
var gulpless = require('gulp-less');
var rename = require('gulp-rename');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var fs = require('fs');
var gulpsync = require('gulp-sync')(gulp);
var babel = require('gulp-babel');


//以下的模块是为了尝试监听less的错误（监听不全）
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var through = require('through2');
var notify = require("gulp-notify");
var combiner = require('stream-combiner2');

//代码着色和显示错误日志
// var handleError = function() {
//     var args = Array.prototype.slice.call(arguments);
//     notify.onError({
//         title: 'compile error',
//         message: '<%=error.message %>'
//     }).apply(this, args); //替换为当前对象
//     this.emit('end'); //提交
// };
var logStream = function(text) {
    return through.obj(function(file, env, callback) {

        // 输出log
        gutil.log(gutil.colors.blue(file.relative) + ' ' + text);
        callback(null, file);
    });
};
// 流错误处理
// var errStream = function(stream, err) {
//     // 输出错误信息
//     util.log(err);
//     stream.emit('error', err);
//     // 结束流
//     stream.emit('end');
// };
// var getLessStream = function() {
//     // less解析出错时的替换内容
//     var errCssMsg = [
//         "body:before{",
//         "content:'这个文件打包出了问题，请检查相应less文件';",
//         "position:fixed;",
//         "background:#000;",
//         "left:0;top:0;padding:1rem;",
//         "}"
//     ].join('');

//     return through.obj(function(file, env, callback) {
//         var self = this;
//         var content = file.contents.toString();
//         // 使用less解析文件内容
//         less.render(content, function(error, output) {
//             console.log(error);
//             if (error) {
//                 // 错误处理
//                 errStream(self, error);

//                 // less解析出错 输出错误提示
//                 file.contents = new Buffer(errCssMsg, 'utf8');
//                 callback(null, file);

//             } else {
//                 // 将解析的内容塞到流内
//                 file.contents = new Buffer(output.css, 'utf8');
//                 callback(null, file);
//             }
//         });
//     });
// };
//遍历文件夹，删删删！！
var deleteFolderRecursive = function(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + '/' + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

//定义一个编译less的任务
gulp.task('less', function() {
    var combined = combiner.obj([
        gulp
        .src('./src/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(logStream('task start'))
        .pipe(plumber())
        .pipe(gulpless())
        // 处理less文件
        //.pipe(getLessStream())
        .pipe(sourcemaps.write())
        .pipe(rename(function(path) {
            path.dirname += "/";
            path.extname = ".wxss";
        }))
        .pipe(gulp.dest('dist'))
        .pipe(logStream('task end'))
    ]);
    combined.on('error', console.error.bind(console));

    return combined;

});
//定义一个打包js的任务
gulp.task('js', function() {
    return gulp
        .src('./src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});
//为了不引起冲突，然后我们在打包的时候还是要清理下以前的文件
gulp.task('remove', function() {
    deleteFolderRecursive('./dist', function() {
        console.log('remove OK');
    });
});
//移动文件夹pages从src到dist
gulp.task('copy', function() {
    return gulp
        .src(['src/**/*.json', 'src/**/*.wxml', 'src/**/*.png'])
        .pipe(gulp.dest('./dist/'));
});
//是不是还是要一个单独的任务来打包其他的任务呢？
gulp.task('default', gulpsync.sync(['remove', 'js', 'less', 'copy']), function() {
    console.log('success!');
});
//监听所有文件变化
gulp.task('watch', function() {
    gulp.watch('src/**').on('change', function(file) {
        var filePath = file.path;
        var extname = path.extname(filePath);
        var distPath = path.dirname(filePath).replace(new RegExp('^' + __dirname + '/'), '').replace(/^src/, 'dist');
        if (extname === '.js') {
            gulp.src(filePath)
                .pipe(babel({
                    presets: ['es2015']
                }))
                .pipe(gulp.dest(distPath));
        } else if (extname === '.less') {
            gulp.src(filePath)
                .pipe(plumber())
                .pipe(gulpless())
                .pipe(rename(function(path) {
                    path.dirname += "/";
                    path.extname = ".wxss";
                }))
                .pipe(gulp.dest(distPath));
        } else if (extname === '.json' || extname === '.wxml') {
            gulp.src(filePath)
                .pipe(gulp.dest(distPath));
        }

    });
});