<template>
  <div class="button">
    {{ props.size }}
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { buttonProps, ButtonProps } from './button';

export default defineComponent({
  name: 'Button',
  props: buttonProps,
  setup: (props: ButtonProps) => {
    console.log('props', props)

    return {props}
  }
})
</script>