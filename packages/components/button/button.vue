<template>
  <div class="button" :style="{color: props.color}">
    {{ props.size }}
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { buttonProps, ButtonProps } from './button';
// setup 语法糖对 ts 不太友好，例如：defineProps<T> 不支持外部导入的类型
// 所以这里使用 defineComponent
export default defineComponent({
  name: 'CQButton',
  props: buttonProps,
  setup: (props) => {
    console.log('props', props)

    return {props}
  }
})
</script>