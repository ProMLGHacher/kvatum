export type EventsChannel = {
  eventsChannel: WebSocket | null;
  isLoading: boolean;
};

export type EventsChannelActions = {
  connect: () => Promise<void>;
  onMessage: (callback: (event: Record<string, any>) => void) => void;
  sendMessage: (message: Record<string, any>) => void;
  close: () => void;
};

export type EventsChannelState = EventsChannel & EventsChannelActions;
