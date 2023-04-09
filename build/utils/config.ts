import path from 'path';
import { outDir } from './paths';

const esmOutPath = path.resolve(outDir, 'es');
const cjsOutPath = path.resolve(outDir, 'lib');

export const buildConfig = {
  esm: {
    module: 'ESNext', // 输出的结果为es6模块
    format: 'esm', // 格式化后的模块规范
    output: {
      name: 'es', // 打包到dist目录下的es目录下
      path: esmOutPath,
    },
    bundle: {
      path: 'cq/es',
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    output: {
      name: 'lib',
      path: cjsOutPath,
    },
    bundle: {
      path: 'cq/lib',
    },
  },
};

export type BuildConfig = typeof buildConfig;
