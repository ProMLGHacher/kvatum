import { ImageWithResolutions } from "@/shared/types/image/imageWithResolution"

export type HubId = Brand<string, "HubId">

export type Hub = {
    id: HubId,
    name: string,
    hexColor: string,
    images: ImageWithResolutions | null
}

export type HubActions = {
    setHubsList: (hubs: Hub[]) => void
    clearHubsList: () => void
    setCurrentHub: (hubId: HubId) => void
}

export type HubStore = {
    currentHub: Hub | null
    hubsList: Hub[] | null
    addHub: (hub: Hub) => void
} & HubActions
