import { series, parallel } from 'gulp';
import { run, withTaskName } from './utils/index';

// gulp 不做打包，做代码转化
// series 串行，一个一个执行
export default series(
  // 删除dist目录
  withTaskName('clean', async () => run('rm -rf ./dist')),
  // 打包样式
  // 打包工具方法
  // 打包所有组件
  // 打包每个组件
  // 生成一个组件库
  // 发布组件
  withTaskName('buildPackages', () =>
    run('pnpm run --filter ./packages --parallel build')
  )
);
