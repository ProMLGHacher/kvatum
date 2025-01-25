import { HubId } from "@/entities/useHub";

import { ImageWithResolutions } from "@/shared/types/image/imageWithResolution";

export type WorkSpaceId = Brand<string, "WorkSpaceId">;

export type WorkSpace = {
  id: WorkSpaceId;
  name: string;
  hexColor: string;
  images: ImageWithResolutions | null;
};

export type WorkSpaceActions = {
  setWorkSpaces: (workSpaceList: WorkSpace[], hubId: HubId) => void;
  addWorkSpace: (workSpace: WorkSpace, hubId: HubId) => void;
  clearWorkSpaces: (hubId: HubId) => void;
  removeWorkSpace: (workSpaceId: WorkSpaceId, hubId: HubId) => void;
  updateWorkSpace: (workSpace: WorkSpace, hubId: HubId) => void;
};

export type WorkSpaceStore = {
  workSpaces: Record<HubId, Record<WorkSpaceId, WorkSpace | null> | null> | null;
} & WorkSpaceActions;
