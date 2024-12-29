import { HubId } from "@/entities/useHub"
import { WorkSpaceId } from "../model/types"
import { ImageUrlWithResolution } from "@/shared/types/image/imageWithResolution"

export type CreateWorkSpaceBody = {
    name: string,
    hubId: HubId
}

export type CreateWorkSpaceDto = {
    name: string
}

export type WorkSpaceDto = {
    id: WorkSpaceId
    name: string    
    hexColor: string
    imageUrls: ImageUrlWithResolution[]
}
