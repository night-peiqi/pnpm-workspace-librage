import path from 'path';
import { series, src, dest } from 'gulp';

import gulpSass from 'gulp-sass';
import darkSass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';

function compile() {
  // TODO api 研究
  const sass = gulpSass(darkSass);
  const paths = path.resolve(__dirname, './src/*.scss');
  return src(paths) // NodeJS.ReadWriteStream 文件流？
    .pipe(sass.sync()) // 把 sass 编译成 css
    .pipe(autoprefixer()) // 给 css 添加前缀，兼容问题
    .pipe(cleanCss()) // 压缩 css
    .pipe(dest('./dist/css')); // 输出目录
}

function copyfont() {
  const paths = path.resolve(__dirname, './src/fonts/**');
  return src(paths).pipe(cleanCss()).pipe(dest('./dist/fonts'));
}

function copyfullStyle() {
  const soursePath = path.resolve(__dirname, './dist/**');
  const targetPath = path.resolve(__dirname, '../../dist/theme-chalk');
  return src(soursePath).pipe(dest(targetPath));
}

export default series(compile, copyfont, copyfullStyle);
