import {
  screenConfig,
  screenConstraints,
  videoConfig,
  camConstraints,
  audioConstraints,
  audioConfig,
  frameType,
  splitValue,
  splitArray,
} from "@/components/player/codes"
import { ElMessage } from "element-plus"
import { Msg, UserMsgPack, EventPack, DataPack, ParkType, FramePack } from "@/proto/ChatMsg"
import { session } from "./storage"

let transport: WebTransport
let DatagramWriter: WritableStreamDefaultWriter
let streamWritable: WritableStreamDefaultWriter
let recvFn: Function = () => {}
let streamDone: Function = () => {}
let recvDatagramFn: Function = () => {}
let startFrameTime = 0

class chatHandler {
  async closed() {
    DatagramWriter?.close()
    transport?.close({
      closeCode: 0,
      reason: "",
    })
  }
  connection(recvDatagram: Function, recvStram: Function, done: Function) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const url = session.get("server") || window.origin
        transport = new WebTransport(url, {
          allowPooling: true,
          congestionControl: "low-latency",
        })
        await transport.ready
        recvDatagramFn = recvDatagram
        recvFn = recvStram
        streamDone = done
        this.acceptUnidirectionalStreams()
        this.recvDatagram()
        DatagramWriter = transport.datagrams.writable.getWriter()
        await DatagramWriter.ready
        this.joinRoome()
        const stream = await transport.createBidirectionalStream()
        streamWritable = stream.writable.getWriter()
        await streamWritable.ready
        recvStram(stream.readable)
        this.reConnection()
        resolve(true)
      } catch (e) {
        ElMessage.error(`Connection Failed : ${e}`)
        this.reConnection()
        reject(false)
      }
    })
  }
  reConnection() {
    try {
      transport.closed
        .then(() => {
          ElMessage.success("Exited")
        })
        .catch(() => {
          ElMessage.error("Connection lost, Reconnect...")
          setTimeout(() => {
            window.location.reload()
          }, 5000)
        })
    } catch (e) {
      console.info("reconnection error :", e)
      ElMessage.error({
        message: "Does not support Webtransport.",
        duration: 10000,
      })
      ElMessage.error({
        message: "Webtransport only support Chrome/Edge/Chromium",
        duration: 10000,
      })
    }
  }
  createStream() {
    return new Promise<WritableStreamDefaultWriter | null>(async (resolve, reject) => {
      try {
        const stream = await transport.createUnidirectionalStream()
        const writable = stream.getWriter()
        await writable.ready
        resolve(writable)
      } catch (e) {
        ElMessage.error(`Open Stream Failed : ${e}`)
        reject(null)
      }
    })
  }
  sendDatagram(msg: Uint8Array) {
    if (msg.length > 1200) {
      ElMessage.error("message is too long")
      return
    }
    if (DatagramWriter) {
      DatagramWriter.write(msg)
    }
  }
  async acceptUnidirectionalStreams() {
    let reader = transport.incomingUnidirectionalStreams.getReader()
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          console.info("Done accepting unidirectional streams!")
          streamDone()
          return
        }
        console.info("New incoming unidirectional stream")
        recvFn(value)
      }
    } catch (e) {
      console.info(e)
    }
  }
  async recvDatagram() {
    try {
      var reader = transport.datagrams.readable.getReader()
      console.info("Datagram reader ready.")
    } catch (e) {
      console.info("Receiving datagrams not supported: " + e, "error")
      return
    }
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          console.info("Done reading datagrams!")
          return
        }
        recvDatagramFn(value)
      }
    } catch (e) {
      console.info(e)
    }
  }
  gotDevices() {
    return new Promise<devices>((resolve, reject) => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((deviceInfos) => {
          const devices = [...deviceInfos].reverse()
          const device = {
            audioinput: <MediaDeviceInfo[]>[],
            videoinput: <MediaDeviceInfo[]>[],
          }
          for (let i = 0; i !== devices.length; ++i) {
            const deviceInfo = devices[i]
            if (deviceInfo.kind === "audioinput") {
              device.audioinput.push(deviceInfo)
            } else if (deviceInfo.kind === "videoinput") {
              device.videoinput.push(deviceInfo)
            } else {
              console.log("Some other kind of source/device: ", deviceInfo)
            }
          }
          resolve(device)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }
  shareMic(local: Function, getChunk: Function, deviceId: string) {
    let audioEncoder: AudioEncoder
    const config = {
      audio: audioConfig,
    }
    const constraints = { ...audioConstraints }
    function initAudioEncoder() {
      audioEncoder = new AudioEncoder({
        output: (chunk: EncodedAudioChunk) => {
          getChunk(chunk, frameType.audio)
        },
        error: (e) => {
          ElMessage.error("audio encoder " + e)
        },
      })
      audioEncoder.configure(audioConstraints)
    }
    if (deviceId.trim()) {
      constraints["deviceId"] = deviceId
    }
    navigator.mediaDevices
      .getUserMedia(config)
      .then(
        (stream) => {
          const audioTracks = stream.getAudioTracks()[0]
          audioTracks.applyConstraints(constraints)
          if (audioTracks) {
            audioTracks.enabled = true
            initAudioEncoder()
            const audioProcessor = new MediaStreamTrackProcessor({ track: audioTracks })
            const audioGenerator = new MediaStreamTrackGenerator({
              kind: "audio",
            })
            const audioTransformer = new TransformStream({
              transform: (frame, controller) => {
                audioEncoder.encode(frame)
                controller.enqueue(frame)
              },
            })
            audioProcessor.readable.pipeThrough(audioTransformer).pipeTo(audioGenerator.writable)

            const audioProcessedStream = new MediaStream()
            audioProcessedStream.addTrack(audioGenerator)
            local(audioProcessedStream, audioTracks)
          }
        },
        (msg) => {
          local(null, null)
          ElMessage.error(`${msg?.toString()}`)
        },
      )
      .catch((e) => {
        ElMessage.error(`Open Mic Failed: ${e}`)
      })
  }
  shareCamera(local: Function, getChunk: Function, deviceId: string) {
    let sendFrames = 0
    let videoEncoder: VideoEncoder
    let videoCfg = { ...videoConfig }
    const constraints = { ...camConstraints }
    const config = {
      video: constraints,
    }
    function initVideoEncoder() {
      videoEncoder = new VideoEncoder({
        output: (chunk) => {
          getChunk(chunk)
        },
        error: (e) => {
          console.error("video encoder error:", e)
        },
      })
      videoEncoder.configure({
        codec: videoCfg.codec,
        height: videoCfg.height,
        width: videoCfg.width,
        bitrate: videoCfg.bitrate,
        latencyMode: "realtime",
      })
    }
    if (deviceId.trim()) {
      constraints["deviceId"] = deviceId
    }
    navigator.mediaDevices
      .getUserMedia(config)
      .then(
        (stream) => {
          const videoTracks = stream.getVideoTracks()[0]
          if (videoTracks) {
            videoTracks.applyConstraints(constraints)
            const videoProcessor = new MediaStreamTrackProcessor({ track: videoTracks })
            const videoGenerator = new MediaStreamTrackGenerator({
              kind: "video",
            })
            initVideoEncoder()
            const videoTransformer = new TransformStream({
              transform: (frame, controller) => {
                if (videoEncoder.encodeQueueSize > 15) {
                  frame.close()
                } else {
                  const insert_keyframe = sendFrames % constraints.frameRate.max === 0
                  videoEncoder.encode(frame, { keyFrame: insert_keyframe })
                  controller.enqueue(frame)
                  sendFrames++
                }
              },
            })
            videoProcessor.readable.pipeThrough(videoTransformer).pipeTo(videoGenerator.writable)
            const processedStream = new MediaStream()
            processedStream.addTrack(videoGenerator)
            local(processedStream, videoTracks)
          }
        },
        (msg) => {
          local(null, null)
          ElMessage.error(`${msg?.toString()}`)
        },
      )
      .catch((e) => {
        ElMessage.error(`Open Camera Failed: ${e}`)
      })
  }
  shareScreen(local: Function, getChunk: Function) {
    let insert_keyframe = true
    let screenFrames = 0
    let screenEncoder: VideoEncoder
    const config: VideoEncoderConfig = {
      codec: screenConfig.codec,
      height: screenConfig.height,
      width: screenConfig.width,
      bitrate: screenConfig.bitrate,
      latencyMode: "realtime",
    }

    function newEncode() {
      screenEncoder = new VideoEncoder({
        output: (chunk) => {
          getChunk(chunk, frameType.screen, insert_keyframe)
        },
        error: (e) => {
          console.error("video encoder error:", e)
        },
      })
    }

    function initScreenEncoder() {
      newEncode()
      screenEncoder.configure(config)
    }

    function handleSuccess(stream: MediaStream) {
      const videoTracks = stream.getVideoTracks()[0]
      videoTracks.applyConstraints(screenConstraints)
      const videoProcessor = new MediaStreamTrackProcessor({ track: videoTracks })
      const videoGenerator = new MediaStreamTrackGenerator({
        kind: "video",
      })
      const videoTransformer = new TransformStream({
        transform: (frame, controller) => {
          if (!screenEncoder) {
            config.width = frame.codedWidth
            config.height = frame.codedHeight
            initScreenEncoder()
            screenFrames = 0
          }
          if (screenEncoder.encodeQueueSize > 15) {
            frame.close()
          } else {
            insert_keyframe = screenFrames % screenConstraints.frameRate.max === 0
            screenEncoder.encode(frame, { keyFrame: insert_keyframe })
            controller.enqueue(frame)
            screenFrames++
          }
        },
      })
      videoProcessor.readable.pipeThrough(videoTransformer).pipeTo(videoGenerator.writable)
      const processedStream = new MediaStream()
      processedStream.addTrack(videoGenerator)
      local(processedStream, videoTracks)
      videoTracks.addEventListener("ended", () => {
        console.info("The user has ended sharing the screen")
      })
    }
    navigator.mediaDevices
      .getDisplayMedia({ audio: false, video: true })
      .then(handleSuccess, (msg) => {
        local(null, null)
        ElMessage.error(`${msg?.toString()}`)
      })
      .catch((e) => {
        ElMessage.error(`Share Filed: ${e}`)
      })
  }
  handleFrameEncoded(writable: WritableStreamDefaultWriter | null, chunk: EncodedVideoChunk, type: number, id: string) {
    const data = new Uint8Array(chunk.byteLength)
    chunk.copyTo(data.buffer)
    if (!startFrameTime) {
      startFrameTime = performance.now()
    }
    const timestamp = (performance.now() - startFrameTime) * 1000
    const encode = FramePack.create({
      time: timestamp.toFixed(0),
      type: chunk.type,
      kind: type,
      fromId: chunk.type === "key" ? id : "",
      frame: data,
    })
    try {
      writable?.write(this.handleFramePack(encode))
    } catch (e) {}
  }
  handleAudioEncoded(chunk: EncodedAudioChunk, type: number, userId: string, close: boolean) {
    const data = new Uint8Array(chunk.byteLength)
    chunk.copyTo(data.buffer)
    const encode = FramePack.create({
      time: chunk.timestamp.toString(),
      type: chunk.type,
      kind: type,
      duration: chunk.duration,
      fromId: userId,
      frame: data,
      close,
    })
    try {
      streamWritable.write(this.handleFramePack(encode))
    } catch (e) {}
  }
  handleFramePack(pack: FramePack) {
    const encodeBuf = this.ChatMsgToBuf(ParkType.Frame_Pack, pack)
    const size = new Uint8Array(splitArray)
    const view = new DataView(size.buffer)
    view.setInt32(4, encodeBuf.length, true)
    view.setInt32(8, -1 * encodeBuf.length, true)
    return this.mergeUint8Arrays(size, encodeBuf)
  }
  mergeUint8Arrays(arr1: Uint8Array, arr2: Uint8Array) {
    const merged = new Uint8Array(arr1.length + arr2.length)
    merged.set(arr1)
    merged.set(arr2, arr1.length)
    return merged
  }
  async recvBuf(stream: ReadableStream, getFrame: Function, recvDone: Function) {
    let recvBuffer: Uint8Array | null = null
    function getCborChunk(buf: Uint8Array | null) {
      if (buf === null) {
        return null
      }
      let buffer = buf
      let view: DataView | null = null
      let size: number = 0
      while (true) {
        const bufLen = buffer.length
        if (bufLen < 12) {
          return buffer
        }
        view = new DataView(buffer.buffer)
        size = view.getInt32(4, true)
        if (bufLen < size + 12) {
          return buffer
        }
        const chunk = buffer.slice(12)
        cborDecode(chunk.slice(0, size))
        buffer = chunk.slice(size)
      }
    }
    function cborDecode(buf: Uint8Array) {
      try {
        getFrame(FramePack.create(Msg.fromBinary(buf).pack["framePack"]))
      } catch (e) {
        console.info("cborDecode :" + e)
      }
    }
    try {
      let reader = stream.getReader()
      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          recvDone()
          return
        }
        if (recvBuffer === null) {
          if (this.checkSplit(value)) {
            recvBuffer = value
          } else {
            let buf = new Uint8Array(value.buffer)
            while (true) {
              const index = buf.indexOf(1)
              if (index === -1) {
                break
              }
              const last = index + 3
              if (buf[last] === 1) {
                const piece = buf.slice(index)
                if (this.checkSplit(piece)) {
                  recvBuffer = piece
                  break
                }
              }
              if (last + 12 < buf.length) {
                buf = buf.slice(last)
              } else {
                break
              }
            }
          }
        } else {
          recvBuffer = this.mergeUint8Arrays(recvBuffer, value)
        }
        recvBuffer = getCborChunk(recvBuffer)
      }
    } catch (e) {
      console.info(e)
    }
  }
  checkSplit(buf: Uint8Array) {
    try {
      const view = new DataView(buf.slice(0, 12).buffer)
      return view.getUint32(0, true) === splitValue && view.getInt32(4, true) + view.getInt32(8, true) === 0
    } catch (e) {
      return false
    }
  }
  ChatMsgToBuf(parkType: ParkType, msg: UserMsgPack | EventPack | DataPack | FramePack) {
    let msgPark: any
    switch (parkType) {
      case ParkType.Event_Pack:
        msgPark = {
          oneofKind: "eventPack",
          eventPack: msg,
        }
        break
      case ParkType.UserMsg_Pack:
        msgPark = {
          oneofKind: "userMsgPack",
          userMsgPack: msg,
        }
        break
      case ParkType.Frame_Pack:
        msgPark = {
          oneofKind: "framePack",
          framePack: msg,
        }
        break
      case ParkType.Data_Pack:
        msgPark = {
          oneofKind: "dataPack",
          dataPack: msg,
        }
        break
      default:
        break
    }
    const chatMsg = Msg.create({
      parkType,
      pack: msgPark,
    })
    return Msg.toBinary(chatMsg)
  }
  joinRoome() {
    const roomId = session.get("roomId")
    const userId = session.get("userId")
    const username = session.get("username")
    const event = EventPack.create()
    event.userId = userId
    event.username = username
    event.roomId = roomId
    event.join = true
    this.sendDatagram(this.ChatMsgToBuf(ParkType.Event_Pack, event))
  }
}

export const ChatUtils = new chatHandler()

export interface videoInfo {
  id: string
  userId: string
  username: string
  kind: number
}

export interface devices {
  audioinput: Array<MediaDeviceInfo>
  videoinput: Array<MediaDeviceInfo>
}

export interface userInfo {
  id: string
  userId: string
  username: string
  speak: boolean
}
