export interface AppEvent<T extends string, P> {
  type: T
  payload: P
}

export interface NewRoomEvent
  extends AppEvent<"room_created", { roomId: string }> {}

export interface RoomUpdatedEvent
  extends AppEvent<"room_updated", { asdkljf: string }> {}

export type AppEvents = NewRoomEvent | RoomUpdatedEvent
