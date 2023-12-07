<template>
  <el-sub-menu v-if="item.children?.length ?? 0 > 0" :index="item.path" popper-append-to-body>
    <template #title>
      <i :class="`iconfont icon-${item.meta?.icon}`"></i>
      <span>{{ item.meta?.title }}</span>
    </template>
    <menu-tree v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.path" @click="navigateTo(item.path)">
    <i :class="`iconfont icon-${item.meta?.icon}`"></i>
    <template #title>{{ item.meta?.title }}</template>
  </el-menu-item>
</template>

<script lang="ts">
export default {
  name: "MenuTree",
}
</script>

<script setup lang="ts">
//un use
import { RouteRecordRaw, useRouter } from "vue-router"

interface Props {
  item: RouteRecordRaw
}

const router = useRouter()

const { item } = defineProps<Props>()

const navigateTo = (path: string) => {
  router.push({ path })
}
</script>

<style lang="scss" scoped>
.iconfont {
  margin: 0 4px;
  font-size: 14px;
}
</style>
