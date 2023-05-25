import { projectRoot, outDir } from "./utils/paths";
import path from "path";
import { series, parallel, src, dest } from "gulp";
import { buildConfig } from "./utils/config";
import gts from "gulp-typescript";
import { withTaskName } from "./utils";
/**
 * 打包所有的 ts 类型文件
 */
// ts 配置文件
const tsConfig = path.resolve(projectRoot, "tsconfig.json");
// 要编译的文件
const inputs = ["**/*.ts", "!gulpfile.ts", "!node_modules"];

// 编译ts
const tsTojs = (output, config) => {
  return () =>
    src(inputs)
      .pipe(
        // 把 ts 转译为 js
        gts.createProject(tsConfig, {
          declaration: true, // 生成类型文件
          strict: false, // 关闭严格模式
          module: config.module,
        })()
      )
      .pipe(dest(output));
};

// 把打包的结果放到全局dist中
const copyFull = (output, packageName, config) => {
  const tp = path.resolve(outDir, config.output.name, packageName);
  console.log("sp======", output, tp);
  return () => src(`${output}/**`).pipe(dest(tp));
};

// 只需要把 ts 转译 js
export const buildPageckages = (buildPath, packageName) => {
  // 需要打包多种模块类型：esm，cjs，...
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const output = path.resolve(outDir, config.output.name, packageName);
    // 返回一个同步任务，每个同步任务中包含多个任务
    return series(withTaskName(`build: ${buildPath}`, tsTojs(output, config)));
  });

  // 并行执行多个同步任务
  return parallel(...tasks);
};
