import { spawn } from "child_process";
import { projectRoot } from "./paths";

/**
 * 给函数添加名字
 * @param name
 * @param fn
 * @returns 带有名字的 fn
 * @description
 * Object.assign(target, sources1, sourses2, ...) 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象
 */
export const withTaskName = (name: string, fn) =>
  Object.assign(fn, { displayName: name });

/**
 * node 中使用子进程运行 命令
 * @param command 要运行的命令
 * @returns Promise
 */
export const run = async (command: string) => {
  console.log("执行命令：", command);
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(" ");
    // 子进程执行命令
    const app = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: "inherit", // 将这个子进程输出共享给父进程
      shell: true,
    });
    app.on("close", resolve);
  });
};

/**
 * 重写打包后的组件库路径
 * @param format
 * @returns
 */
export const pathRewriter = (format) => {
  return (id: string) => {
    id = id.replaceAll("@cq", `cq/${format}`);
    return id;
  };
};
