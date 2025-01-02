import { toImageWithResolutions } from "@/shared/types/image/toImageWithResolutions"
import { WorkSpaceDto } from "../api/types"
import { WorkSpace } from "../model/types"

export const toWorkSpace = (dto: WorkSpaceDto): WorkSpace => {
    return {
        id: dto.id,
        name: dto.name,
        hexColor: dto.hexColor,
        images: toImageWithResolutions(dto.imageUrls)
    }
}