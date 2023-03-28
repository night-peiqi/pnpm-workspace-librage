import type { ExtractPropTypes } from "vue";

// 定义组件的 props 参数
export const buttonProps = {
  size: { type: Number },
  color: { type: String }
}

// 导出 props 参数的类型
export type ButtonProps = ExtractPropTypes<typeof buttonProps>