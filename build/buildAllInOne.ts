import path from "path";
import fs from "fs/promises";
import { parallel } from "gulp";
import { rollup, OutputOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve"; // 处理文件路径
import commonjs from "@rollup/plugin-commonjs"; // 将 CommonJS 模块转换为 ES6
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import { componentRoot, outDir } from "./utils/paths";
import { buildConfig } from "./utils/config";
import { pathRewriter } from "./utils";

/**
 * 把所有组件打包到一个js文件里
 * @returns 输出打包的文件到 outdir 目录
 */
const buildFull = async () => {
  // rollup 打包配置
  const config = {
    input: path.resolve(__dirname, "../packages/components/index.ts"), // 打包入口
    plugins: [nodeResolve(), typescript(), vue(), commonjs()],
    external: (id) => /^vue/.test(id), // 打包的时候不打包vue代码
  };

  // bundle 输入配置
  const buildConfig = [
    {
      format: "umd", // 打包的格式
      file: path.resolve(outDir, "index.js"),
      name: "CqComponents", // 全局变量名字
      exports: "named", // 导出的名字 用命名的方式导出 libaryTarget:"" name:""
      globals: {
        // 表示使用的vue是全局的
        vue: "Vue",
      },
    },
    {
      format: "esm",
      file: path.resolve(outDir, "index.esm.js"),
    },
  ];

  // 解析组件库，执行 tree-shaking，生成 bundle
  const bundle = await rollup(config);

  // 根据不同的打包模式 生成不同的 bundle 并写入文件
  return Promise.all(
    buildConfig.map(async (option) => {
      bundle.write(option as OutputOptions);
    })
  );
};

// 多入口打包（保持原有代码目录）
const buildMultipleEntry = async () => {
  // 读取组件库目录下的所有内容，包括目录和文件
  const entryFiles = await fs.readdir(componentRoot, { withFileTypes: true });
  console.log("entryFiles", entryFiles);
  // 过滤掉 不是文件的内容和package.json文件  index.ts 作为打包入口
  const entries = entryFiles
    .filter((f) => f.isFile())
    .filter((f) => !["package.json"].includes(f.name))
    .map((f) => path.resolve(componentRoot, f.name));

  console.log("entries", entries);

  const config = {
    input: entries,
    plugins: [nodeResolve(), vue(), typescript()],
    external: (id: string) => /^vue/.test(id) || /^@w-plus/.test(id),
  };

  const bundle = await rollup(config);
  return Promise.all(
    Object.values(buildConfig)
      .map((config) => ({
        format: config.format,
        dir: config.output.path,
        // paths: pathRewriter(config.output.name),
      }))
      .map((option) => bundle.write(option as OutputOptions))
  );
};

// TODO 看下这俩方法是不是执行一个就可以了，copy一份到es和lib目录可以吗
export const buildAllInOne = parallel(buildFull, buildMultipleEntry);
