<template>
  <div class="page-container">
    <div class="left-content" v-show="!stopCam || !showCamCenter">
      <div class="self-stream" v-show="!stopCam">
        <video v-show="!stopCam" ref="video" autoplay muted></video>
        <video v-show="false" ref="screen" autoplay muted></video>
      </div>
      <div class="user-list" v-show="!showCamCenter">
        <VideoPlayer
          :visibilityState="visibilityState"
          :key="info.id.slice(info.id.length / 2)"
          :playInfo="info"
          :direct="false"
          v-for="info in videoLsit"
          ref="videoItemRefs"
        />
        <UserCard :userDetails="info" v-for="info in friendList" :key="uuidv4" ref="userCardRefs" />
      </div>
    </div>
    <div class="on-show">
      <vueDanmaku
        v-model:danmus="danmus"
        ref="danmakuRef"
        :channels="8"
        :font-size="28"
        :speeds="100"
        randomChannel
        style="position: absolute; pointer-events: none; height: 500px; width: 100%"
      />
      <div class="options">
        <el-button @click="test">Test</el-button>
        <el-text class="mx-1" size="small" type="danger" style="margin: 0 15px" v-show="!!delay.time"
          >Max: {{ delay.max }}ms</el-text
        >
        <el-text class="mx-1" size="small" type="warning" style="margin: 0 15px" v-show="!!delay.time"
          >Current: {{ delay.time }}ms</el-text
        >
        <el-text class="mx-1" size="small" type="success" style="margin: 0 15px" v-show="!!delay.time"
          >Min: {{ delay.min }}ms</el-text
        >
        <span v-if="isMuted" style="display: flex; align-items: center"
          >Muted:<img :src="muteIcon" @click="playback" height="30" style="margin-right: 15px; cursor: pointer"
        /></span>
        <el-popover :width="300" trigger="click">
          <template #reference>
            <el-button type="success" :icon="Message" circle style="margin-right: 50px" />
          </template>
          <el-input
            v-model="readyMsg"
            :autosize="{ minRows: 4, maxRows: 6 }"
            :maxlength="1000"
            type="textarea"
            placeholder="Enter Message"
            style="margin-bottom: 22px; margin-top: 5px"
          />
          <el-button
            @click="broadcastMsg"
            :disabled="!connected"
            type="success"
            size="small"
            style="position: absolute; right: 12px; bottom: 5px"
            >Send</el-button
          >
        </el-popover>
        <p class="title">Camera:</p>
        <el-select v-model="camId" v-if="deviceInfos.videoinput.length && stopCam">
          <el-option
            v-for="item in deviceInfos.videoinput"
            :key="uuidv4"
            :label="item.label || 'default'"
            :value="item.deviceId"
          />
        </el-select>
        <el-button v-if="stopCam" :disabled="!stopCam && !connected" @click="shareCam" type="warning"
          >Share Cam</el-button
        >
        <el-button v-else @click="stopShare(frameType.camera)" type="danger">Stop</el-button>
        <p class="title">Mic:</p>
        <el-select v-model="micId" v-if="deviceInfos.audioinput.length && stopMic">
          <el-option
            v-for="item in deviceInfos.audioinput"
            :key="uuidv4"
            :label="item.label || 'default'"
            :value="item.deviceId"
          />
        </el-select>
        <el-button @click="shareMic" v-if="stopMic" :disabled="!stopMic && !connected" type="success"
          >Share Mic</el-button
        >
        <el-button @click="stopShare(frameType.audio)" v-else type="danger">Stop</el-button>
        <el-button @click="shareScreen" v-if="stopScreen" :disabled="!stopScreen && !connected" type="primary"
          >Share Screen</el-button
        >
        <el-button @click="stopShare(frameType.screen)" v-else type="danger">Stop Screen</el-button>
        <el-button @click="closed" type="danger" style="margin: 0px 50px">Exit</el-button>
        <audiocontext @playState="updateState" v-show="false" ref="audio" />
      </div>
      <UserCard v-if="showCamCenter" :userDetails="info" v-for="info in friendList" :key="uuidv4" />
      <VideoPlayer
        :visibilityState="visibilityState"
        :key="info.userId"
        :playInfo="info"
        :direct="true"
        v-for="info in screenLsit"
        ref="screenItemRefs"
      />
      <VideoPlayer
        :visibilityState="visibilityState"
        :key="info.id"
        :playInfo="info"
        :direct="false"
        v-for="info in videoLsit"
        ref="videoManRefs"
        v-show="showCamCenter"
        style="width: 300px; padding: 0px 5px"
      />
    </div>
    <audio v-show="false" ref="loaclAudio" controls autoplay muted></audio>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, onMounted, nextTick, computed } from "vue"
import { Msg, UserMsgPack, EventPack, DataPack, ParkType, FramePack } from "@/proto/ChatMsg"
import { useRouter } from "vue-router"
import { ChatUtils, videoInfo, devices } from "@/utils/chatHandler"
import { v4 as uuidv4 } from "uuid"
import VideoPlayer from "@/components/player/video.vue"
import audiocontext from "@/components/player/audiocontext.vue"
import UserCard from "@/components/userList/index.vue"
import { frameType } from "@/components/player/codes"
import { ElMessage, ElNotification } from "element-plus"
import { session } from "@/utils/storage"
import { userInfo } from "../../utils/chatHandler"
import { Message } from "@element-plus/icons-vue"
import vueDanmaku from "vue3-danmaku"
import muteIcon from "@/components/player/mute.svg"

type ChildCtx = InstanceType<typeof VideoPlayer>

type userEle = InstanceType<typeof UserCard>

const videoItemRefs = ref<Array<ChildCtx>>([])
const videoManRefs = ref<Array<ChildCtx>>([])
const screenItemRefs = ref<Array<ChildCtx>>([])
const userCardRefs = ref<Array<userEle>>([])

const connected = ref(false)
const stopCam = ref(true)
const stopScreen = ref(true)
const stopMic = ref(true)
const danmakuRef = ref()

const router = useRouter()
const visibilityState = ref(true)
const audio = ref()
const video = ref()
const screen = ref()
const loaclAudio = ref()
const danmus = ref([])

const friendList = ref<Array<userInfo>>([])
const videoLsit = ref<Array<videoInfo>>([])
const screenLsit = ref<Array<videoInfo>>([])
const deviceInfos = ref<devices>({
  videoinput: [],
  audioinput: [],
})
const delay = ref({
  id: "",
  time: "",
  max: "0",
  min: "1000",
  interval: 0,
})
const myId = ref("")
const camId = ref("")
const micId = ref("")
const readyMsg = ref("")
const isMuted = ref(true)

const showCamCenter = computed(() => {
  return !screenLsit.value.length
})

const test = async () => {
  console.info(audio.value.getState())
  const buf = new Uint8Array([1, 1, 1, 1])
  const view = new DataView(buf.buffer)
  const values = view.getInt32(0, true)
  console.info("get", values)
  console.info(buf)
}

const getDelay = () => {
  delay.value.interval = window.setInterval(() => {
    sendDelayPack()
  }, 3000)
}

const sendDelayPack = () => {
  try {
    const park = DataPack.create()
    delay.value.id = uuidv4()
    const data = {
      id: delay.value.id,
      time: performance.now(),
    }
    park.data = JSON.stringify(data)
    const buf = ChatUtils.ChatMsgToBuf(ParkType.Data_Pack, park)
    ChatUtils.sendDatagram(buf)
  } catch (error) {
    console.info(error)
  }
}

const playback = () => {
  audio.value.playback()
}

const updateState = (val: boolean) => {
  isMuted.value = val
  if (isMuted.value) {
    ElMessage.warning("Now muted, please click to unmute")
  }
}

const stopShare = (type: number) => {
  if (type === frameType.camera) {
    stopCam.value = true
  }
  if (type === frameType.screen) {
    stopScreen.value = true
  }
  if (type === frameType.audio) {
    stopMic.value = true
  }
}

const shareCam = async () => {
  let writable: WritableStreamDefaultWriter | null = null
  stopCam.value = false
  let tracks: MediaStreamTrack | null
  ChatUtils.shareCamera(
    async (stream: MediaStream | null, videoTracks: MediaStreamTrack | null) => {
      if (videoTracks === null && stream === null) {
        stopCam.value = true
        return
      }
      writable = await ChatUtils.createStream()
      if (writable === null) {
        videoTracks?.stop()
        ElMessage.error("连接失败，请重试")
        return
      }
      tracks = videoTracks
      video.value.srcObject = stream
      refreshDevices()
    },
    (chunk: EncodedVideoChunk) => {
      if (stopCam.value) {
        try {
          writable?.close()
          tracks?.stop()
        } catch (error) {
          console.info("stopCam error :", error)
        }
        return
      }
      ChatUtils.handleFrameEncoded(writable, chunk, frameType.camera, myId.value)
    },
    camId.value,
  )
}

const shareMic = async () => {
  stopMic.value = false
  let audioTracks: MediaStreamTrack | null
  let count = 0
  ChatUtils.shareMic(
    async (stream: MediaStream | null, tracks: MediaStreamTrack | null) => {
      if (tracks === null && stream === null) {
        stopMic.value = true
        count = 0
        return
      }
      audioTracks = tracks
      loaclAudio.value.srcObject = stream
      loaclAudio.value.play()
      refreshDevices()
    },
    (chunk: EncodedAudioChunk) => {
      if (stopMic.value) {
        ChatUtils.handleAudioEncoded(chunk, frameType.audio, myId.value, true)
        audioTracks?.stop()
        count = 0
        return
      }
      const id = count % 200 === 0 ? myId.value : ""
      ChatUtils.handleAudioEncoded(chunk, frameType.audio, id, false)
      count++
    },
    micId.value,
  )
}

const shareScreen = async () => {
  let writable: WritableStreamDefaultWriter | null = null
  stopScreen.value = false
  let tracks: MediaStreamTrack | null
  ChatUtils.shareScreen(
    async (stream: MediaStream | null, videoTracks: MediaStreamTrack | null) => {
      if (stream === null && videoTracks === null) {
        stopScreen.value = true
        return
      }
      writable = await ChatUtils.createStream()
      if (writable === null) {
        videoTracks?.stop()
        ElMessage.error("连接失败，请重试")
        return
      }
      tracks = videoTracks
      screen.value.srcObject = stream
      refreshDevices()
    },
    (chunk: EncodedVideoChunk) => {
      if (stopScreen.value) {
        try {
          writable?.close()
          tracks?.stop()
        } catch (error) {
          console.info("stopScreen error :", error)
        }
        return
      }
      ChatUtils.handleFrameEncoded(writable, chunk, frameType.screen, myId.value)
    },
  )
}

const broadcastMsg = () => {
  if (!readyMsg.value.trim()) {
    return
  }
  const roomId = session.get("roomId")
  const username = session.get("username")
  const msg = UserMsgPack.create({
    roomId,
    userId: myId.value,
    username,
    content: readyMsg.value,
  })
  const buf = ChatUtils.ChatMsgToBuf(ParkType.UserMsg_Pack, msg)
  ChatUtils.sendDatagram(buf)
  readyMsg.value = ""
}

const recvDatagram = (buffer: Uint8Array) => {
  const recvMsg = Msg.fromBinary(new Uint8Array(buffer))
  switch (recvMsg.parkType) {
    case ParkType.Event_Pack:
      const eventMsg = EventPack.create(recvMsg.pack["eventPack"])
      handlerEventPack(eventMsg)
      break
    case ParkType.UserMsg_Pack:
      const userMsg = UserMsgPack.create(recvMsg.pack["userMsgPack"])
      danmakuRef.value.insert(`${userMsg.username}: ${userMsg.content}`)
      break
    case ParkType.Data_Pack:
      const dataMsg = DataPack.create(recvMsg.pack["dataPack"])
      handlerDataPack(dataMsg)
      break
    default:
      break
  }
}

const handlerDataPack = (pack: DataPack) => {
  try {
    const data = JSON.parse(pack.data)
    if (data.id === delay.value.id) {
      delay.value.time = (performance.now() - data.time).toFixed(2)
      delay.value.id = ""
      delay.value.max = Math.max(parseFloat(delay.value.max), parseFloat(delay.value.time)).toFixed(2)
      delay.value.min = Math.min(parseFloat(delay.value.min), parseFloat(delay.value.time)).toFixed(2)
    }
  } catch (error) {
    console.info(error)
  }
}

const handlerEventPack = (pack: EventPack) => {
  if (pack.join) {
    if (!friendList.value.some((u) => u.userId === pack.userId) && pack.userId !== myId.value) {
      friendList.value.push({
        userId: pack.userId,
        username: pack.username,
        id: uuidv4(),
        speak: false,
      })
      ChatUtils.joinRoome()
    }
  }
  if (pack.leave) {
    friendList.value = friendList.value.filter((u) => u.userId !== pack.userId)
  }
}

const recvStream = (stream: ReadableStream) => {
  console.info("New Stream Coming... Start Decode")
  let el: null | ChildCtx = null
  let manEl: null | ChildCtx = null
  let wait = false
  let cacheFrames: Array<EncodedVideoChunk> = []
  let uuid = ""
  let tips: any = null
  async function addAndgetPlayer(id: string, kind: number) {
    if (!id.trim()) {
      return
    }
    uuid = uuidv4()
    if (kind === frameType.camera) {
      const has = videoLsit.value.some((x) => x.userId === id)
      if (!has) {
        wait = true
        videoLsit.value.push({
          id: uuid,
          userId: id,
          username: friendList.value.find((u) => u.userId === id)?.username || "",
          kind,
        })
      }
    }
    if (kind === frameType.screen) {
      const has = screenLsit.value.some((x) => x.userId === id)
      if (!has) {
        wait = true
        screenLsit.value.push({
          id: uuid,
          userId: id,
          username: friendList.value.find((u) => u.userId === id)?.username || "",
          kind,
        })
      }
    }
    await nextTick()
    if (kind === frameType.camera) {
      videoManRefs.value.forEach((ele) => {
        if (ele.getInfo().userId === id && ele.getInfo().id === uuid) {
          manEl = ele
        }
      })
      videoItemRefs.value.forEach((ele) => {
        if (ele.getInfo().userId === id && ele.getInfo().id === uuid) {
          el = ele
        }
      })
      if (showCamCenter.value) {
        loadCacheFrame(manEl)
      } else {
        loadCacheFrame(el)
      }
    }
    if (kind === frameType.screen) {
      screenItemRefs.value.forEach((ele) => {
        if (ele.getInfo().userId === id && ele.getInfo().id === uuid) {
          el = ele
        }
      })
      loadCacheFrame(el)
    }
    wait = false
  }
  function loadCacheFrame(palyer: ChildCtx | null) {
    if (!palyer) {
      cacheFrames = []
      return
    }
    while (cacheFrames.length) {
      const frame = cacheFrames.shift()
      if (frame) {
        palyer.decode(frame)
      }
    }
  }
  function buildDecodeChunk(chunk: FramePack) {
    try {
      const encodeChunk: any = {
        type: chunk.type,
        timestamp: Number(chunk.time),
        data: chunk.frame,
      }
      if (chunk.kind === frameType.audio) {
        encodeChunk.duration = chunk.duration
        audio.value?.decode(new EncodedAudioChunk(encodeChunk))
        if (!tips && chunk.fromId) {
          const msg = friendList.value.find((u) => u.userId === chunk.fromId)?.username || ""
          if (msg) {
            tips = ElNotification({
              type: "info",
              message: `Speaking: ${msg}`,
              position: "bottom-right",
              duration: 10000,
              onClose: () => {
                tips = null
              },
            })
          }
        }
        if (chunk.close) {
          tips?.close()
          tips = null
        }
        return
      }
      const frame = new EncodedVideoChunk(encodeChunk)
      if (chunk.kind === frameType.screen) {
        if (el === null) {
          if (!wait) {
            addAndgetPlayer(chunk.fromId, chunk.kind)
          }
          cacheFrames.push(frame)
          return
        }
        el?.decode(frame)
        return
      }
      if (chunk.kind === frameType.camera) {
        if (el === null || manEl === null) {
          if (!wait) {
            addAndgetPlayer(chunk.fromId, chunk.kind)
          }
          cacheFrames.push(frame)
          return
        }
        if (showCamCenter.value) {
          manEl?.decode(frame)
        } else {
          el?.decode(frame)
        }
      }
    } catch (error) {
      console.info("build frame chunk failed :", error)
    }
  }
  ChatUtils.recvBuf(
    stream,
    (chunk: FramePack) => {
      buildDecodeChunk(chunk)
    },
    () => {
      if (!uuid) {
        return
      }
      videoLsit.value = videoLsit.value.filter((x) => x.id !== uuid)
      screenLsit.value = screenLsit.value.filter((x) => x.id !== uuid)
      console.info("Stream is Closed...  Player Should Close")
    },
  )
}

const streamDone = () => {
  console.info("acceptUnidirectionalStreams Done!!!")
}

const initWebtranpsort = () => {
  const roomId = session.get("roomId")
  const username = session.get("username")
  if (roomId && username) {
    const userId = uuidv4()
    myId.value = userId
    session.set("userId", userId)
    ChatUtils.connection(recvDatagram, recvStream, streamDone).then(() => {
      connected.value = true
      sendDelayPack()
      getDelay()
      ElMessage.success({
        message: "connection success",
        duration: 2000,
      })
    })
  } else {
    router.replace({ name: "login" })
  }
}

const closed = () => {
  connected.value = false
  window.clearInterval(delay.value.interval)
  ChatUtils.closed()
  router.replace({ name: "login" })
}

const refreshDevices = () => {
  ChatUtils.gotDevices().then((list) => {
    deviceInfos.value.audioinput = [...list.audioinput]
    deviceInfos.value.videoinput = [...list.videoinput]
    if (!micId.value) {
      micId.value = list.audioinput[0]?.deviceId ?? micId.value
    }
    if (!camId.value) {
      camId.value = list.videoinput[0]?.deviceId ?? camId.value
    }
  })
}

onMounted(() => {
  document.addEventListener("visibilitychange", () => {
    visibilityState.value = document.visibilityState === "visible"
  })
  ChatUtils.gotDevices()
    .then((list) => {
      deviceInfos.value = list
      if (deviceInfos.value.audioinput.length) {
        micId.value = deviceInfos.value.audioinput[0].deviceId
      }
      if (deviceInfos.value.videoinput.length) {
        camId.value = deviceInfos.value.videoinput[0].deviceId
      }
      console.info("deviceInfos :", deviceInfos.value)
    })
    .catch((e) => {
      console.info(e)
    })
})

onBeforeMount(() => {
  initWebtranpsort()
})
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #f0fffe;

  .left-content {
    display: flex;
    flex-direction: column;
    width: 300px;
    .self-stream {
      margin-top: 5px;
      display: flex;
      flex-direction: column;
      width: 300px;
      border: 2px solid #f20f0f;
    }
    .user-list {
      display: flex;
      flex-direction: column;
      width: 300px;
      border: 1px dashed #bad7ff;
      border-radius: 10px;
    }
  }

  .on-show {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-content: flex-start;
    border: 1px dashed #d0ffbb;
    border-radius: 10px;
    padding: 5px;

    .user-style {
      width: 300px;
      height: 300px;
      margin: 0 8px 8px 0;
    }
    .options {
      position: absolute;
      top: 0;
      left: 0;
      height: 60px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .title {
        margin-right: 10px;
        margin-left: 16px;
      }
    }
    .video-style {
      width: 100%;
    }
  }
}
</style>
