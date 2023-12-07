// @generated by protobuf-ts 2.9.1 with parameter long_type_string,server_none
// @generated from protobuf file "ChatMsg.proto" (syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime"
import type { IBinaryWriter } from "@protobuf-ts/runtime"
import { WireType } from "@protobuf-ts/runtime"
import type { BinaryReadOptions } from "@protobuf-ts/runtime"
import type { IBinaryReader } from "@protobuf-ts/runtime"
import { UnknownFieldHandler } from "@protobuf-ts/runtime"
import type { PartialMessage } from "@protobuf-ts/runtime"
import { reflectionMergePartial } from "@protobuf-ts/runtime"
import { MESSAGE_TYPE } from "@protobuf-ts/runtime"
import { MessageType } from "@protobuf-ts/runtime"
/**
 * @generated from protobuf message Msg
 */
export interface Msg {
  /**
   * @generated from protobuf field: ParkType parkType = 1;
   */
  parkType: ParkType
  /**
   * @generated from protobuf oneof: Pack
   */
  pack:
    | {
        oneofKind: "eventPack"
        /**
         * @generated from protobuf field: EventPack eventPack = 2;
         */
        eventPack: EventPack
      }
    | {
        oneofKind: "userMsgPack"
        /**
         * @generated from protobuf field: UserMsgPack userMsgPack = 3;
         */
        userMsgPack: UserMsgPack
      }
    | {
        oneofKind: "dataPack"
        /**
         * @generated from protobuf field: DataPack dataPack = 4;
         */
        dataPack: DataPack
      }
    | {
        oneofKind: "framePack"
        /**
         * @generated from protobuf field: FramePack framePack = 5;
         */
        framePack: FramePack
      }
    | {
        oneofKind: undefined
      }
}
/**
 * @generated from protobuf message EventPack
 */
export interface EventPack {
  /**
   * @generated from protobuf field: string username = 1;
   */
  username: string
  /**
   * @generated from protobuf field: string userId = 2;
   */
  userId: string
  /**
   * @generated from protobuf field: string roomId = 3;
   */
  roomId: string
  /**
   * @generated from protobuf field: bool leave = 5;
   */
  leave: boolean
  /**
   * @generated from protobuf field: bool join = 6;
   */
  join: boolean
}
/**
 * @generated from protobuf message UserMsgPack
 */
export interface UserMsgPack {
  /**
   * @generated from protobuf field: string roomId = 1;
   */
  roomId: string
  /**
   * @generated from protobuf field: string userId = 2;
   */
  userId: string
  /**
   * @generated from protobuf field: string username = 3;
   */
  username: string
  /**
   * @generated from protobuf field: string content = 4;
   */
  content: string
}
/**
 * @generated from protobuf message DataPack
 */
export interface DataPack {
  /**
   * @generated from protobuf field: string username = 1;
   */
  username: string
  /**
   * @generated from protobuf field: string userId = 2;
   */
  userId: string
  /**
   * @generated from protobuf field: string roomId = 3;
   */
  roomId: string
  /**
   * @generated from protobuf field: string data = 4;
   */
  data: string
}
/**
 * @generated from protobuf message FramePack
 */
export interface FramePack {
  /**
   * @generated from protobuf field: bytes frame = 1;
   */
  frame: Uint8Array
  /**
   * @generated from protobuf field: string fromId = 2;
   */
  fromId: string
  /**
   * @generated from protobuf field: string type = 3;
   */
  type: string
  /**
   * @generated from protobuf field: uint32 kind = 4;
   */
  kind: number
  /**
   * @generated from protobuf field: uint64 time = 5;
   */
  time: string
  /**
   * @generated from protobuf field: uint32 duration = 6;
   */
  duration: number
  /**
   * @generated from protobuf field: bool close = 7;
   */
  close: boolean
}
/**
 * @generated from protobuf enum ParkType
 */
export enum ParkType {
  /**
   * @generated from protobuf enum value: Event_Pack = 0;
   */
  Event_Pack = 0,
  /**
   * @generated from protobuf enum value: UserMsg_Pack = 1;
   */
  UserMsg_Pack = 1,
  /**
   * @generated from protobuf enum value: Data_Pack = 2;
   */
  Data_Pack = 2,
  /**
   * @generated from protobuf enum value: Frame_Pack = 3;
   */
  Frame_Pack = 3,
}
// @generated message type with reflection information, may provide speed optimized methods
class Msg$Type extends MessageType<Msg> {
  constructor() {
    super("Msg", [
      { no: 1, name: "parkType", kind: "enum", T: () => ["ParkType", ParkType] },
      { no: 2, name: "eventPack", kind: "message", oneof: "pack", T: () => EventPack },
      { no: 3, name: "userMsgPack", kind: "message", oneof: "pack", T: () => UserMsgPack },
      { no: 4, name: "dataPack", kind: "message", oneof: "pack", T: () => DataPack },
      { no: 5, name: "framePack", kind: "message", oneof: "pack", T: () => FramePack },
    ])
  }
  create(value?: PartialMessage<Msg>): Msg {
    const message = { parkType: 0, pack: { oneofKind: undefined } }
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this })
    if (value !== undefined) reflectionMergePartial<Msg>(this, message, value)
    return message
  }
  internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Msg): Msg {
    let message = target ?? this.create(),
      end = reader.pos + length
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag()
      switch (fieldNo) {
        case /* ParkType parkType */ 1:
          message.parkType = reader.int32()
          break
        case /* EventPack eventPack */ 2:
          message.pack = {
            oneofKind: "eventPack",
            eventPack: EventPack.internalBinaryRead(reader, reader.uint32(), options, (message.pack as any).eventPack),
          }
          break
        case /* UserMsgPack userMsgPack */ 3:
          message.pack = {
            oneofKind: "userMsgPack",
            userMsgPack: UserMsgPack.internalBinaryRead(
              reader,
              reader.uint32(),
              options,
              (message.pack as any).userMsgPack,
            ),
          }
          break
        case /* DataPack dataPack */ 4:
          message.pack = {
            oneofKind: "dataPack",
            dataPack: DataPack.internalBinaryRead(reader, reader.uint32(), options, (message.pack as any).dataPack),
          }
          break
        case /* FramePack framePack */ 5:
          message.pack = {
            oneofKind: "framePack",
            framePack: FramePack.internalBinaryRead(reader, reader.uint32(), options, (message.pack as any).framePack),
          }
          break
        default:
          let u = options.readUnknownField
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`)
          let d = reader.skip(wireType)
          if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d)
      }
    }
    return message
  }
  internalBinaryWrite(message: Msg, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
    /* ParkType parkType = 1; */
    if (message.parkType !== 0) writer.tag(1, WireType.Varint).int32(message.parkType)
    /* EventPack eventPack = 2; */
    if (message.pack.oneofKind === "eventPack")
      EventPack.internalBinaryWrite(
        message.pack.eventPack,
        writer.tag(2, WireType.LengthDelimited).fork(),
        options,
      ).join()
    /* UserMsgPack userMsgPack = 3; */
    if (message.pack.oneofKind === "userMsgPack")
      UserMsgPack.internalBinaryWrite(
        message.pack.userMsgPack,
        writer.tag(3, WireType.LengthDelimited).fork(),
        options,
      ).join()
    /* DataPack dataPack = 4; */
    if (message.pack.oneofKind === "dataPack")
      DataPack.internalBinaryWrite(
        message.pack.dataPack,
        writer.tag(4, WireType.LengthDelimited).fork(),
        options,
      ).join()
    /* FramePack framePack = 5; */
    if (message.pack.oneofKind === "framePack")
      FramePack.internalBinaryWrite(
        message.pack.framePack,
        writer.tag(5, WireType.LengthDelimited).fork(),
        options,
      ).join()
    let u = options.writeUnknownFields
    if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer)
    return writer
  }
}
/**
 * @generated MessageType for protobuf message Msg
 */
export const Msg = new Msg$Type()
// @generated message type with reflection information, may provide speed optimized methods
class EventPack$Type extends MessageType<EventPack> {
  constructor() {
    super("EventPack", [
      { no: 1, name: "username", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 2, name: "userId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 3, name: "roomId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 5, name: "leave", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
      { no: 6, name: "join", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
    ])
  }
  create(value?: PartialMessage<EventPack>): EventPack {
    const message = { username: "", userId: "", roomId: "", leave: false, join: false }
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this })
    if (value !== undefined) reflectionMergePartial<EventPack>(this, message, value)
    return message
  }
  internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EventPack): EventPack {
    let message = target ?? this.create(),
      end = reader.pos + length
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag()
      switch (fieldNo) {
        case /* string username */ 1:
          message.username = reader.string()
          break
        case /* string userId */ 2:
          message.userId = reader.string()
          break
        case /* string roomId */ 3:
          message.roomId = reader.string()
          break
        case /* bool leave */ 5:
          message.leave = reader.bool()
          break
        case /* bool join */ 6:
          message.join = reader.bool()
          break
        default:
          let u = options.readUnknownField
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`)
          let d = reader.skip(wireType)
          if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d)
      }
    }
    return message
  }
  internalBinaryWrite(message: EventPack, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
    /* string username = 1; */
    if (message.username !== "") writer.tag(1, WireType.LengthDelimited).string(message.username)
    /* string userId = 2; */
    if (message.userId !== "") writer.tag(2, WireType.LengthDelimited).string(message.userId)
    /* string roomId = 3; */
    if (message.roomId !== "") writer.tag(3, WireType.LengthDelimited).string(message.roomId)
    /* bool leave = 5; */
    if (message.leave !== false) writer.tag(5, WireType.Varint).bool(message.leave)
    /* bool join = 6; */
    if (message.join !== false) writer.tag(6, WireType.Varint).bool(message.join)
    let u = options.writeUnknownFields
    if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer)
    return writer
  }
}
/**
 * @generated MessageType for protobuf message EventPack
 */
export const EventPack = new EventPack$Type()
// @generated message type with reflection information, may provide speed optimized methods
class UserMsgPack$Type extends MessageType<UserMsgPack> {
  constructor() {
    super("UserMsgPack", [
      { no: 1, name: "roomId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 2, name: "userId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 3, name: "username", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 4, name: "content", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
    ])
  }
  create(value?: PartialMessage<UserMsgPack>): UserMsgPack {
    const message = { roomId: "", userId: "", username: "", content: "" }
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this })
    if (value !== undefined) reflectionMergePartial<UserMsgPack>(this, message, value)
    return message
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: UserMsgPack,
  ): UserMsgPack {
    let message = target ?? this.create(),
      end = reader.pos + length
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag()
      switch (fieldNo) {
        case /* string roomId */ 1:
          message.roomId = reader.string()
          break
        case /* string userId */ 2:
          message.userId = reader.string()
          break
        case /* string username */ 3:
          message.username = reader.string()
          break
        case /* string content */ 4:
          message.content = reader.string()
          break
        default:
          let u = options.readUnknownField
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`)
          let d = reader.skip(wireType)
          if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d)
      }
    }
    return message
  }
  internalBinaryWrite(message: UserMsgPack, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
    /* string roomId = 1; */
    if (message.roomId !== "") writer.tag(1, WireType.LengthDelimited).string(message.roomId)
    /* string userId = 2; */
    if (message.userId !== "") writer.tag(2, WireType.LengthDelimited).string(message.userId)
    /* string username = 3; */
    if (message.username !== "") writer.tag(3, WireType.LengthDelimited).string(message.username)
    /* string content = 4; */
    if (message.content !== "") writer.tag(4, WireType.LengthDelimited).string(message.content)
    let u = options.writeUnknownFields
    if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer)
    return writer
  }
}
/**
 * @generated MessageType for protobuf message UserMsgPack
 */
export const UserMsgPack = new UserMsgPack$Type()
// @generated message type with reflection information, may provide speed optimized methods
class DataPack$Type extends MessageType<DataPack> {
  constructor() {
    super("DataPack", [
      { no: 1, name: "username", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 2, name: "userId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 3, name: "roomId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 4, name: "data", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
    ])
  }
  create(value?: PartialMessage<DataPack>): DataPack {
    const message = { username: "", userId: "", roomId: "", data: "" }
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this })
    if (value !== undefined) reflectionMergePartial<DataPack>(this, message, value)
    return message
  }
  internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DataPack): DataPack {
    let message = target ?? this.create(),
      end = reader.pos + length
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag()
      switch (fieldNo) {
        case /* string username */ 1:
          message.username = reader.string()
          break
        case /* string userId */ 2:
          message.userId = reader.string()
          break
        case /* string roomId */ 3:
          message.roomId = reader.string()
          break
        case /* string data */ 4:
          message.data = reader.string()
          break
        default:
          let u = options.readUnknownField
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`)
          let d = reader.skip(wireType)
          if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d)
      }
    }
    return message
  }
  internalBinaryWrite(message: DataPack, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
    /* string username = 1; */
    if (message.username !== "") writer.tag(1, WireType.LengthDelimited).string(message.username)
    /* string userId = 2; */
    if (message.userId !== "") writer.tag(2, WireType.LengthDelimited).string(message.userId)
    /* string roomId = 3; */
    if (message.roomId !== "") writer.tag(3, WireType.LengthDelimited).string(message.roomId)
    /* string data = 4; */
    if (message.data !== "") writer.tag(4, WireType.LengthDelimited).string(message.data)
    let u = options.writeUnknownFields
    if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer)
    return writer
  }
}
/**
 * @generated MessageType for protobuf message DataPack
 */
export const DataPack = new DataPack$Type()
// @generated message type with reflection information, may provide speed optimized methods
class FramePack$Type extends MessageType<FramePack> {
  constructor() {
    super("FramePack", [
      { no: 1, name: "frame", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
      { no: 2, name: "fromId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 3, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 4, name: "kind", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
      { no: 5, name: "time", kind: "scalar", T: 4 /*ScalarType.UINT64*/ },
      { no: 6, name: "duration", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
      { no: 7, name: "close", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
    ])
  }
  create(value?: PartialMessage<FramePack>): FramePack {
    const message = { frame: new Uint8Array(0), fromId: "", type: "", kind: 0, time: "0", duration: 0, close: false }
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this })
    if (value !== undefined) reflectionMergePartial<FramePack>(this, message, value)
    return message
  }
  internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FramePack): FramePack {
    let message = target ?? this.create(),
      end = reader.pos + length
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag()
      switch (fieldNo) {
        case /* bytes frame */ 1:
          message.frame = reader.bytes()
          break
        case /* string fromId */ 2:
          message.fromId = reader.string()
          break
        case /* string type */ 3:
          message.type = reader.string()
          break
        case /* uint32 kind */ 4:
          message.kind = reader.uint32()
          break
        case /* uint64 time */ 5:
          message.time = reader.uint64().toString()
          break
        case /* uint32 duration */ 6:
          message.duration = reader.uint32()
          break
        case /* bool close */ 7:
          message.close = reader.bool()
          break
        default:
          let u = options.readUnknownField
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`)
          let d = reader.skip(wireType)
          if (u !== false) (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d)
      }
    }
    return message
  }
  internalBinaryWrite(message: FramePack, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
    /* bytes frame = 1; */
    if (message.frame.length) writer.tag(1, WireType.LengthDelimited).bytes(message.frame)
    /* string fromId = 2; */
    if (message.fromId !== "") writer.tag(2, WireType.LengthDelimited).string(message.fromId)
    /* string type = 3; */
    if (message.type !== "") writer.tag(3, WireType.LengthDelimited).string(message.type)
    /* uint32 kind = 4; */
    if (message.kind !== 0) writer.tag(4, WireType.Varint).uint32(message.kind)
    /* uint64 time = 5; */
    if (message.time !== "0") writer.tag(5, WireType.Varint).uint64(message.time)
    /* uint32 duration = 6; */
    if (message.duration !== 0) writer.tag(6, WireType.Varint).uint32(message.duration)
    /* bool close = 7; */
    if (message.close !== false) writer.tag(7, WireType.Varint).bool(message.close)
    let u = options.writeUnknownFields
    if (u !== false) (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer)
    return writer
  }
}
/**
 * @generated MessageType for protobuf message FramePack
 */
export const FramePack = new FramePack$Type()
