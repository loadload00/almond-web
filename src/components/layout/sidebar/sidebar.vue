<template>
  <div class="app-sidebar">
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.app-sidebar {
  height: 100%;
  background: #304156;

  ::v-deep(.el-menu) {
    border-right: none;

    .el-sub-menu__title {
      height: 50px;
    }

    .el-sub-menu {
      .el-menu-item {
        height: 50px;
        background: #1f2d3d;
      }
    }

    .el-menu-item {
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
