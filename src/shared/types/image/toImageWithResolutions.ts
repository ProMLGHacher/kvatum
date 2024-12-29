import { ImageUrlWithResolution, ImageWithResolutions } from "./imageWithResolution"

export const toImageWithResolutions = (imageUrls: ImageUrlWithResolution[]): ImageWithResolutions | null => {
    return imageUrls.length ? imageUrls.reduce((acc, image) => {
        acc[image.resolution] = image.urlImage
        return acc
    }, {} as ImageWithResolutions) : null
}