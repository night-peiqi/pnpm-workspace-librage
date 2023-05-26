import { series, parallel } from "gulp";
import { run, withTaskName } from "./utils/index";

export { buildAllInOne } from "./buildAllInOne";

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

    // 打包所有组件
    // 执行build命令调用rollup打包，执行名字叫 buildAllInOne 的任务
    withTaskName("buildAllInOne", async () =>
      run("pnpm run build buildAllInOne")
    )
    // 打包每个组件
  )
  // 生成一个组件库
  // 发布组件
);
