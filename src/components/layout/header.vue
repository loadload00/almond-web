<template>
  <div class="app-header">
    <div class="left"></div>
    <div class="content"></div>
    <div class="right">
      <userInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import userInfo from "@/components/layout/useinfo/index.vue"
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;

  .left,
  .right {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .content {
    flex: 1;
    min-width: 1px;
    min-height: 1px;
  }
}
</style>
