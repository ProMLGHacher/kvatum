import { ImageUrlWithResolution } from "@/shared/types/image/imageWithResolution"
import { HubId } from "../model/types"

export type HubDto = {
    id: HubId
    name: string
    hexColor: string
    images: ImageUrlWithResolution[]
}

export type CreateHubBody = {
    name: string
}
