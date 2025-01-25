import { ImageWithResolutions } from "@/shared/types/image/imageWithResolution";

export type HubId = Brand<string, "HubId">;

export type Hub = {
  id: HubId;
  name: string;
  hexColor: string;
  images: ImageWithResolutions | null;
};

export type HubActions = {
  setHubs: (hubs: Hub[]) => void;
  clearHubs: () => void;
  addHub: (hub: Hub) => void;
  removeHub: (hubId: HubId) => void;
  updateHub: (hub: Hub) => void;
};

export type HubStore = {
  hubs: Record<HubId, Hub> | null;
} & HubActions;
