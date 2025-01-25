import { hubsApi } from "@/entities/useHub/api/hubsApi";
import { useHubs } from "@/entities/useHub";
import { CreateHubBody } from "@/entities/useHub/api/types";
import { getHubWorkSpacesAction } from "@/features/workSpaces";
import { getChannelsAction } from "@/features/channels";
import { WorkSpaceId } from "@/entities/useWorkSpcae";
import { useWorkSpace } from "@/entities/useWorkSpcae";

export const createHubAction = async (newHub: CreateHubBody) => {
  const hub = await hubsApi.createHub(newHub);
  await getHubWorkSpacesAction(hub.id);
  const workSpaces = Object.keys(useWorkSpace.getState().workSpaces?.[hub.id] ?? {});
  await Promise.all(workSpaces.map((workSpace) => getChannelsAction(workSpace as WorkSpaceId)));
  useHubs.getState().addHub(hub);
};
