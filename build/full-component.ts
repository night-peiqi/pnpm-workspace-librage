import { parallel } from "gulp";
import { rollup, OutputOptions } from "rollup";
import path from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve"; // 处理文件路径
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import commonjs from "@rollup/plugin-commonjs"; // 将 CommonJS 模块转换为 ES6

const buildFull = async () => {
  // rollup 打包配置
  const config = {
    input: path.resolve(__dirname, "../packages/components/index.ts"), // 打包入口
    plugins: [nodeResolve(), typescript(), vue(), commonjs()],
    external: (id) => /^vue/.test(id), // 打包的时候不打包vue代码,
  };

  // TODO 打包这一步卡住了
  const bundle = await rollup(config);
  console.log("bundle", JSON.stringify(bundle));

  return Promise.resolve();
};
const buildEntry = async () => {
  console.log("buildEntry");
  return Promise.resolve();
};

export const buildFullComponent = parallel(buildFull, buildEntry);
