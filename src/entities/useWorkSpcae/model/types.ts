import { ImageWithResolutions } from "@/shared/types/image/imageWithResolution"

export type WorkSpaceId = Brand<string, "WorkSpaceId">

export type WorkSpace = {
    id: WorkSpaceId,
    name: string,
    hexColor: string,
    images: ImageWithResolutions | null
  }

export type WorkSpaceActions = {
    setWorkSpaceList: (workSpaceList: WorkSpace[]) => void,
    addWorkSpace: (workSpace: WorkSpace) => void,
    setCurrentWorkSpace: (workSpace: WorkSpace) => void,
    clearWorkSpace: () => void,
}

export type WorkSpaceStore = {
    workSpaceList: WorkSpace[] | null,
    currentWorkSpace: WorkSpace | null,
} & WorkSpaceActions