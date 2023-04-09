import { projectRoot, outDir } from './utils/paths';
import path from 'path';
import { series, parallel, src, dest } from 'gulp';
import { buildConfig } from './utils/config';
import gts from 'gulp-typescript';
/**
 * 打包所有的 ts 类型文件
 */
// ts 配置文件
const tsConfig = path.resolve(projectRoot, 'tsconfig.json');
// 要编译的文件
const inputs = ['**/*.ts', '!gulpfile.ts', '!node_modules'];

// 编译ts
const tsTojs = (output, config) => {
  return () =>
    src(inputs)
      .pipe(
        // 把 ts 转译为 js
        gts.createProject(tsConfig, {
          declaration: true, // 生成类型文件
          strict: false,
          module: config.module,
        })()
      )
      .pipe(dest(output));
};

// 把打包的结果放到全局dist中
const copyFull = (soursePath, packageName, config) => {
  const sp = path.resolve(soursePath, config.output.name, '**');
  const tp = path.resolve(outDir, packageName, config.output.name);
  console.log('sp======', sp);
  return () => src(sp).pipe(dest(tp));
};

// 只需要把 ts 转译 js
export const buildPageckages = (buildPath, packageName) => {
  // 需要打包多种模块类型：esm，cjs，...
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const output = path.resolve(buildPath, config.output.name);

    return series(
      tsTojs(output, config),
      copyFull(buildPath, packageName, config)
    );
  });

  // 并行打包 cjs 和 esm 两种格式的包
  return parallel(...tasks);
};
