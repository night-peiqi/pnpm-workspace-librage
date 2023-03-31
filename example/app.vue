<template>
  测试效果
  <Button :size="123">这里是按钮</Button>
  <CQButton :size="123546" color="red">长轻按钮</CQButton>
  <CQIcon color="green" :size="30" class="cq-icon-heikeji3">icon</CQIcon>
</template>

<script lang="ts" setup>
import Button from "@cq/components/button";
</script>