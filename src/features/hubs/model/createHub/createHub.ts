import { hubsApi } from "@/entities/useHub/api/hubsApi";
import { useHubs } from "@/entities/useHub";
import { CreateHubBody } from "@/entities/useHub/api/types";
import { getHubWorkSpacesAction } from "@/features/workSpaces/model/getHubWorkSpaces/getHubWorkSpaces";

export const createHubAction = async (newHub: CreateHubBody) => {
  const hub = await hubsApi.createHub(newHub);
  await getHubWorkSpacesAction(hub.id);
  useHubs.getState().addHub(hub);
};
