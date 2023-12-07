<template>
  <div v-if="isEnabled" class="fullscreen-component" @click="onToggle">
    <i :class="`iconfont ${isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'}`"></i>
  </div>
</template>

<script setup lang="ts">
import screenfull from "screenfull"
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

const isFullscreen = ref(false)

const isEnabled = computed(() => screenfull.isEnabled)

const onToggle = () => {
  screenfull.toggle()
}

const onChange = () => {
  isFullscreen.value = screenfull.isFullscreen
}

onMounted(() => {
  if (isEnabled.value) {
    screenfull.on("change", onChange)
  }
})

onBeforeUnmount(() => {
  if (isEnabled.value) {
    screenfull.off("change", onChange)
  }
})
</script>

<style lang="scss" scoped>
.fullscreen-component {
  display: flex;
  flex-direction: row;
  padding: 8px;
}
</style>
