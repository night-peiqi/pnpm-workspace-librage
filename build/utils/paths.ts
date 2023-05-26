import path from "path";

export const projectRoot = path.resolve(__dirname, "../../");

// 组件库代码目录
export const componentRoot = path.resolve(
  __dirname,
  "../../packages/components"
);

export const outDir = path.resolve(__dirname, "../../dist");
