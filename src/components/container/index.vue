<template>
  <div class="app-container">
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  min-height: 100%;
  padding: 12px;
  background-color: var(--el-background-color-base);

  .container {
    flex: 1;
    min-height: 100%;
    width: 100%;
    background-color: var(--el-color-white);
    border-radius: var(--el-border-radius-base);
  }
}
</style>
