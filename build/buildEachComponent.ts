import { series } from "gulp";
import glob, { sync } from "fast-glob";
import path from "path";
import fs from "fs/promises";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import { OutputOptions, rollup } from "rollup";
import { Project, SourceFile } from "ts-morph";
import * as VueCompiler from "@vue/compiler-sfc";
import { componentRoot, outDir, projectRoot } from "./utils/paths";
import { buildConfig } from "./utils/config";

// 打包每个组件
const buildComponent = () => {
  // 查找components下所有的组件目录 ["icon", "button"]
  const files = sync("*", {
    cwd: componentRoot,
    onlyDirectories: true, // 只查找文件夹
  });

  // rollup 编译组件代码，并且写入到输出目录
  const builds = files.map(async (file) => {
    // 找到每个组件的入口文件
    const input = path.resolve(componentRoot, file, "index.ts");
    // rullup 编译配置
    const config = {
      input,
      plugins: [nodeResolve(), typescript(), vue(), commonjs()],
      external: (id) => /^vue/.test(id) || /^@cq/.test(id), // 排除掉vue和@cq的依赖
    };

    // 生成抽象语法树 ast，执行 tree-shaking，生成 bundle
    const bundle = await rollup(config);

    // 输出不同模块规范的代码
    // 输出配置
    const options = Object.values(buildConfig).map((config) => ({
      format: config.format,
      file: path.resolve(config.output.path, `components/${file}/index.js`),
      exports: "named",
    }));

    // 根据不同的打包模式 生成不同的 bundle 并写入文件
    await Promise.all(
      options.map((option) => bundle.write(option as OutputOptions))
    );
  });

  return Promise.all(builds);
};

// 生成类型文件
const genTypes = async () => {
  // 生成.d.ts 我们需要有一个tsconfig
  const project = new Project({
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: true,
      outDir: path.resolve(outDir, "types"),
      baseUrl: projectRoot,
      paths: {
        "@cq/*": ["packages/*"],
      },
      skipLibCheck: true,
      strict: false,
    },
    tsConfigFilePath: path.resolve(projectRoot, "tsconfig.json"),
    skipAddingFilesFromTsConfig: true,
  });

  // **/* 组件库下所有目录中的文件
  const filePaths = await glob("**/*", {
    // 查找组件库下所有文件
    cwd: componentRoot,
    onlyFiles: true,
    absolute: true,
  });

  // 包含所有 ts 的源文件
  const sourceFiles: SourceFile[] = [];

  await Promise.all(
    filePaths.map(async function (file) {
      if (file.endsWith(".vue")) {
        // 读取单文件组件内容
        const content = await fs.readFile(file, "utf8");
        // 把内容编译成为js描述对象
        const sfc = VueCompiler.parse(content);
        // TODO 如果组件中使用setup语法，要使用 scriptSetup
        const { script } = sfc.descriptor;
        if (script) {
          // 拿到vue组件中的 script 部分代码
          let content = script.content;
          // 创建TypeScript源文件
          const sourceFile = project.createSourceFile(file + ".ts", content);
          sourceFiles.push(sourceFile);
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file); // 把所有的ts文件都放在一起 发射成.d.ts文件
        sourceFiles.push(sourceFile);
      }
    })
  );

  // 只发出d.ts文件，默认是放到内存中的
  await project.emit({
    emitOnlyDtsFiles: true,
  });

  sourceFiles.map(async (sourceFile: any) => {
    const emitOutput = sourceFile.getEmitOutput();
    emitOutput.getOutputFiles().map(async (outputFile: any) => {
      const filepath = outputFile.getFilePath();
      // 创建类型声明文件
      await fs.mkdir(path.dirname(filepath), {
        recursive: true,
      });
      // 写入文件内容
      await fs.writeFile(filepath, outputFile.getText());
    });
  });
};

export const buildEachComponent = series(buildComponent, genTypes);
