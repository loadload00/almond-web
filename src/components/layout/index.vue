<template>
  <el-container>
    <el-container>
      <el-header>
        <v-header :isCollapse="sidebarCollapseState" />
      </el-header>

      <el-main>
        <Container>
          <router-view v-slot="{ Component, route }" :style="style">
            <transition
              mode="out-in"
              appear
              enter-from-class="enter-from"
              enter-active-class="animate"
              :enter-to-class="enterAnimate"
              leave-active-class="animate"
              :leave-to-class="leaveAnimate"
            >
              <component :is="Component" :key="route.path"></component>
            </transition>
          </router-view>
        </Container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Container from "../container/index.vue"
import vHeader from "./header.vue"
import { CSSProperties, computed } from "vue"
import { useSettingsStore } from "@/store/useSettingsStore"

const settingsStore = useSettingsStore()

const sidebarCollapseState = computed(() => settingsStore.sidebarCollapseState)

const duration = computed<number>(() => settingsStore.animateDuration)

const enterAnimate = computed<string>(() => settingsStore.enterAnimate)

const leaveAnimate = computed<string>(() => settingsStore.leaveAnimate)

const style = computed<CSSProperties>(() => ({ "--duration": `${duration.value}ms` }))
</script>

<style lang="scss" scoped>
.animate {
  animation-duration: var(--duration);
}

.enter-from {
  opacity: 0;
}

.el-container {
  height: 100%;

  .el-aside {
    overflow-x: hidden;
    transition: width 0.3s;
  }

  .el-header {
    background-color: #f3feff;
    border-bottom: 1px solid var(--el-border-color-base);
  }

  .el-main {
    padding: 0;
    overflow-x: hidden;
  }
}
</style>
