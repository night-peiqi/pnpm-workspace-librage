<template>
  <i class="cq-icon" :style="iconStyle">
    <slot />
  </i>
</template>

<script lang="ts">
import { computed, defineComponent, StyleValue } from 'vue';
import { iconProps, IconProps } from './icon';
// setup 语法糖对 ts 不太友好，例如：defineProps<T> 不支持外部导入的类型
// 所以这里使用 defineComponent
export default defineComponent({
  name: 'CQIcon',
  props: iconProps,
  setup: (props) => {
    const iconStyle = computed(() => {
      return {
        fontSize: props.size + 'px',
        color: props.size
      }
    })

    return {iconStyle} as any
  }
})
</script>