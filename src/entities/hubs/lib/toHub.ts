import { Hub } from "../model/types"
import { HubDto } from "../api/types"
import { toImageWithResolutions } from "@/shared/types/image/toImageWithResolutions"
export const toHub = (hubDto: HubDto): Hub => {
  return {
    id: hubDto.id,
    name: hubDto.name,
    hexColor: hubDto.hexColor,
    images: toImageWithResolutions(hubDto.images),
  }
}
