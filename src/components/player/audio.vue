<template>
  <audio v-show="true" ref="audio" :key="playInfo.userId" controls autoplay></audio>
</template>
<script setup lang="ts">
import { audioConstraints } from "./codes"
import { onMounted, ref } from "vue"
import { ElMessage } from "element-plus"
import { userInfo } from "@/utils/chatHandler"

let audioDecoder: any

const audio = ref()

interface Props {
  playInfo: userInfo
}
const { playInfo } = defineProps<Props>()
const decode = (frame: any) => {
  try {
    audioDecoder.decode(frame)
  } catch (error) {}
}
const getState = () => {
  return audio.value?.paused
}
const playback = () => {
  audio.value.play()
}
const getInfo = () => {
  return playInfo
}

defineExpose({
  decode,
  getState,
  playback,
  getInfo,
})

const initAudioDecoder = () => {
  const audioGenerator = new MediaStreamTrackGenerator({ kind: "audio" })
  const audioWriter = audioGenerator.writable.getWriter()

  console.log("writer:", audioWriter)
  audioDecoder = new AudioDecoder({
    output: (frame: any) => {
      if (audioWriter) {
        audioWriter.write(frame)
      }
    },
    error: (error: any) => {
      console.error("audio decoder " + error)
    },
  })

  audioDecoder.configure(audioConstraints)

  let processedStream = new MediaStream()
  processedStream.addTrack(audioGenerator)
  audio.value.srcObject = processedStream
}

onMounted(() => {
  try {
    initAudioDecoder()
  } catch (error) {
    ElMessage.error(`Not supported! ${error}`)
  }
})
</script>
