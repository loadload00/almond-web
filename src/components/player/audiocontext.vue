<template>
  <div></div>
</template>
<script setup lang="ts">
import { audioConstraints } from "./codes"
import { onMounted } from "vue"
import { ElMessage } from "element-plus"

let audioDecoder: any
let audioContext: any

const decode = (frame: any) => {
  try {
    audioDecoder?.decode(frame)
  } catch (e) {
    console.info("audio decode error :", e)
  }
}
const getState = () => {
  return audioContext.state === "suspended"
}
const playback = () => {
  audioContext = null
  initAudioDecoder()
  playState()
  console.info("resume")
}
const suspend = () => {
  audioContext = null
}
const emit = defineEmits(["playState"])

const playState = () => {
  emit("playState", getState())
}

defineExpose({
  decode,
  getState,
  playback,
  suspend,
})

const initAudioDecoder = () => {
  audioDecoder = null
  const audioGenerator = new MediaStreamTrackGenerator({ kind: "audio" })
  const audioWriter = audioGenerator.writable.getWriter()

  console.log("writer:", audioWriter)
  audioDecoder = new AudioDecoder({
    output: (frame) => {
      if (audioWriter) {
        audioWriter.write(frame)
      }
    },
    error: (e) => {
      console.error("audio decoder ", e)
    },
  })
  audioDecoder.configure(audioConstraints)

  const processedStream = new MediaStream()
  processedStream.addTrack(audioGenerator)
  try {
    audioContext = new AudioContext()
    const sourceNode = audioContext.createMediaStreamSource(processedStream)
    sourceNode.connect(audioContext.destination)
    sourceNode.mediaStream.getTracks().forEach((t: MediaStreamTrack) => {
      t.enabled = true
    })
  } catch (e) {
    console.error("AudioContext Error:", e)
  }
}

onMounted(() => {
  try {
    initAudioDecoder()
    playState()
  } catch (e) {
    ElMessage.error(`Not supported! ${e}`)
  }
})
</script>
