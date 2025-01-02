import { ImageResolution } from "./imageResolution"

export type ImageUrlWithResolution = {
    resolution: ImageResolution,
    urlImage: string
}

export type ImageWithResolutions = Record<ImageResolution, string>
