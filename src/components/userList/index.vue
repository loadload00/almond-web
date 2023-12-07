<template>
  <div class="user-style" ref="content">
    <span class="name" ref="name">{{ userDetails.username }}</span>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { userInfo } from "../../utils/chatHandler"

interface Props {
  userDetails: userInfo
}

const { userDetails } = defineProps<Props>()

const content = ref()

const name = ref()

const getInfo = () => {
  return userDetails
}
const random = (num: number) => {
  return Math.floor(Math.random() * num)
}
const color = () => {
  name.value.style.fontSize = `${50 - userDetails.username.length * 3}px`
  content.value.style.backgroundColor = `rgb(${random(40)}, ${random(40)}, ${random(40)})`
  name.value.style.color = `rgb(${random(55) + 200}, ${random(55) + 200}, ${random(55) + 200})`
}
defineExpose({
  getInfo,
})
onMounted(() => {
  color()
})
</script>
<style lang="scss" scoped>
.user-style {
  display: flex;
  padding: 10px;
  flex-direction: column;
  height: 150px;
  width: 100%;
  background-color: rgb(40, 40, 40);
  .name {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Reggae One", CenturyGothic, "AppleGothic";
    height: 100%;
    margin: auto;
    color: #ffffff;
  }
  .name:hover {
    text-shadow: 0 0 10px #0ebeff, 0 0 20px #0ebeff, 0 0 50px #0ebeff, 0 0 100px #0ebeff, 0 0 200px #0ebeff;
  }
  video {
    width: 100%;
  }
}
</style>
