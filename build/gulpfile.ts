import { series, parallel } from "gulp";
import { run, withTaskName } from "./utils/index";
import { genTypes } from "./gen-types";
import { outDir, componentRoot } from "./utils/paths";

export { buildAllInOne } from "./buildAllInOne";
export { buildEachComponent } from "./buildEachComponent";

const copySourceCode = () => async () => {
  await run(`cp ${componentRoot}/package.json ${outDir}/package.json`);
};

// gulp 不做打包，做代码转化
// series 串行，一个一个执行
export default series(
  // 删除dist目录
  withTaskName("clean", async () => run("rm -rf ./dist")),
  parallel(
    // 打包样式
    // 打包工具方法
    withTaskName("buildPackages", async () =>
      run("pnpm run --filter ./packages/* --parallel build")
    ),

    // 把所有组件打包到一个js文件
    // 执行build命令调用rollup打包，执行名字叫 buildAllInOne 的任务
    withTaskName("buildAllInOne", async () =>
      run("pnpm run build buildAllInOne")
    ),
    // 打包每个组件
    withTaskName("buildEachComponent", () =>
      run("pnpm run build buildEachComponent")
    )
  ),
  parallel(genTypes, copySourceCode())
  // 发布组件
);
