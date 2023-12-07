<template>
  <div class="page-container">
    <el-button type="primary" @click="onBack">Back to home</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

const onBack = () => {
  router.replace("/")
}
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  padding-top: 64px;
  background-image: url("@/assets/images/404.jpeg");
  background-repeat: no-repeat;
  background-position: center;
}
</style>
