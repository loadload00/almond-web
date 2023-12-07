// screen and camera video codec
export const codec = "vp09.00.10.08"

export const audioConfig = {
  channelCount: 2,
  sampleRate: 48000,
}
export const screenConfig = {
  codec: codec,
  bitrate: 4e6,
  framerate: 30,
  width: 1920,
  height: 1080,
}
// screen video config
export const screenConstraints = {
  width: { min: 640, ideal: 1920, max: 2160 },
  height: { min: 400, ideal: 1080, max: 1440 },
  // aspectRatio: 1.77,
  frameRate: { max: 30 },
}
// camera video config
export const videoConfig = {
  codec: codec,
  width: 720,
  height: 720,
  bitrate: 3e6,
  frameRate: { min: 30, max: 60 },
  latencyMode: "realtime",
}
export const camConstraints = {
  width: { min: 480, ideal: 720, max: 1080 },
  height: { min: 480, ideal: 720, max: 1080 },
  frameRate: { min: 30, max: 60 },
}
//audio codec
export const audioConstraints = {
  codec: "opus",
  numberOfChannels: 2,
  sampleRate: 48000,
  bitrate: 512e3,
  // deviceId:''
}
// media frame type
export const frameType = {
  camera: 0,
  screen: 1,
  audio: 2,
}
// media frame split
export const splitValue = 16843009
// media frame header
export const splitArray = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
