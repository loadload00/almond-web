<template>
  <div class="video-style" :style="playStart ? '' : { border: '1px solid rgb(255, 50, 10)', height: '300px' }">
    <div v-if="!playStart" class="video-loader">
      <span class="loader"></span>
    </div>
    <video :key="playInfo.id + playInfo.kind" ref="video" autoplay muted></video>
    <span class="info" :style="playStart ? '' : { backgroundColor: 'rgb(255, 50, 10)' }">{{ playInfo.username }}</span>
  </div>
</template>
<script setup lang="ts">
import { codec } from "./codes"
import { onMounted, ref, toRefs } from "vue"
import { ElMessage } from "element-plus"
import { videoInfo } from "@/utils/chatHandler"

let videoDecoder: VideoDecoder

const video = ref()
const playStart = ref(false)
const init = ref(true)

interface Props {
  visibilityState: boolean
  playInfo: videoInfo
  direct: boolean
}

const prop = defineProps<Props>()

const { visibilityState, playInfo, direct } = toRefs(prop)

const decode = async (frame: EncodedVideoChunk) => {
  try {
    if (!playStart.value) {
      if (init.value) {
        return
      }
      if (frame.type !== "key") {
        return
      }
      videoDecoder.decode(frame)
      video.value.play()
      playStart.value = true
      console.info("got key fream start play ", playInfo.value.username, playInfo.value.userId)
    }
    videoDecoder.decode(frame)
  } catch (e) {
    playStart.value = false
    init.value = true
    initPlayer()
    video.value.play()
    console.info("decode error :", e)
  }
}
const getInfo = () => {
  return playInfo.value
}
const startPlay = () => {
  video.value.play()
}
defineExpose({
  decode,
  getInfo,
  startPlay,
})

const initPlayer = function () {
  let pendingFrames: Array<VideoFrame> = []
  let baseTime = 0
  let fixTime = 0

  function handleFrame(frame: VideoFrame) {
    pendingFrames.push(frame)
    if (!visibilityState.value || pendingFrames.length > 30) {
      videoWriter.write(pendingFrames.shift())
      return
    }
    setTimeout(renderFrame, 0)
  }

  function calculateTimeUntilNextFrame(timestamp: number) {
    if (baseTime == 0) {
      baseTime = performance.now()
      fixTime = timestamp
    }
    timestamp = timestamp - fixTime
    const mediaTime = performance.now() - baseTime
    return Math.max(0, timestamp / 1000 - mediaTime)
  }

  async function renderFrame() {
    if (pendingFrames.length === 0) {
      return
    }
    const frame = pendingFrames.shift()
    if (frame) {
      let timeUntilNextFrame = calculateTimeUntilNextFrame(frame.timestamp)
      if (direct.value) {
        timeUntilNextFrame = Math.min(timeUntilNextFrame, 60)
      } else {
        timeUntilNextFrame = Math.min(timeUntilNextFrame, 250)
      }
      await new Promise((r) => {
        setTimeout(r, timeUntilNextFrame)
      })
      videoWriter.write(frame)
    }
    setTimeout(renderFrame, 0)
  }

  const videoGenerator = new MediaStreamTrackGenerator({ kind: "video" })
  const videoWriter = videoGenerator.writable.getWriter()
  videoDecoder = new VideoDecoder({
    output: (frame) => {
      handleFrame(frame)
    },
    error: (e) => {
      playStart.value = false
      console.error("video Decoder decode error:", e)
    },
  })
  videoDecoder.configure({ codec: codec })
  init.value = false
  let processedStream = new MediaStream()
  processedStream.addTrack(videoGenerator)
  video.value.srcObject = processedStream
}
onMounted(() => {
  try {
    initPlayer()
  } catch (e) {
    ElMessage.error(`Not supported! ${e}`)
  }
})
</script>
<style lang="scss" scoped>
.video-style {
  display: flex;
  padding: 5px;
  flex-direction: column;
  .info {
    display: flex;
    height: 12px;
    align-items: center;
    background-color: rgb(203, 255, 210);
    justify-content: center;
    font-size: 12px;
    font-family: "Reggae One", CenturyGothic, "AppleGothic";
  }
  video {
    width: 100%;
    min-height: 260px;
  }
  .video-loader {
    position: relative;
    top: 40%;
    left: 50%;
  }
  .loader,
  .loader:before,
  .loader:after {
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    animation-fill-mode: both;
    animation: bblFadInOut 1.8s infinite ease-in-out;
  }
  .loader {
    color: rgb(255, 50, 10);
    font-size: 7px;
    position: relative;
    text-indent: -9999em;
    transform: translateZ(0);
    animation-delay: -0.16s;
  }
  .loader:before,
  .loader:after {
    content: "";
    position: absolute;
    top: 0;
  }
  .loader:before {
    left: -3.5em;
    animation-delay: -0.32s;
  }
  .loader:after {
    left: 3.5em;
  }
  @keyframes bblFadInOut {
    0%,
    80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
}
</style>
