/*
 * @Author: jarisMA
 * @Date: 2020-01-14 16:53:12
 * @LastEditTime : 2020-01-15 16:52:39
 * @LastEditors  : jarisMA
 */
var gulp = require('gulp')
var rev = require('gulp-rev') // 给每个文件添加版本号（根据文件内容算出来的hash码）
var revReplace = require('gulp-rev-replace') // 更新index中的引用
var useref = require('gulp-useref') // 注释告诉gulp怎么处理文件
var filter = require('gulp-filter') // 筛选和恢复
var uglify = require('gulp-uglify') // 压缩js代码的插件
var csso = require('gulp-csso') // 压缩css代码的插件

/**默认任务，可不输入任务名称执行 */
gulp.task('default', function () {
  var jsFilter = filter('**/*.js', { restore: true })
  var cssFilter = filter('**/*.css', { restore: true })
  var indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true }) // 排除首页，避免被更改名字

  return gulp.src('src/index.html')
    .pipe(useref()) // 将注释中的文件扔入流中
    .pipe(jsFilter) // 筛选出js文件
    .pipe(uglify()) // 压缩js文件
    .pipe(jsFilter.restore) // 将文件扔回流中
    .pipe(cssFilter) // 筛选出css文件
    .pipe(csso()) // 压缩css文件
    .pipe(cssFilter.restore) // 将文件扔回流中
    .pipe(indexHtmlFilter) // 筛选出除了首页的所有文件
    .pipe(rev()) // 生成hash版本号名
    .pipe(indexHtmlFilter.restore) // 将文件扔回流中
    .pipe(revReplace()) // 把index中对于文件的引用更新
    .pipe(gulp.dest('dist')) // 把文件扔到该目录下
})