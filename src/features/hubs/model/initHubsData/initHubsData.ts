import { WorkSpaceId } from "@/entities/useWorkSpcae";

import { useHubs } from "@/entities/useHub";
import { getJoinedHubsAction } from "../getJoinedHubs/getJoinedHubs";
import { getHubWorkSpacesAction } from "@/features/workSpaces/model/getHubWorkSpaces/getHubWorkSpaces";
import { useWorkSpace } from "@/entities/useWorkSpcae";
import { getChannelsAction } from "@/features/channels/model/getChannels/getChannels";

export const initHubsDataAction = async () => {
  await getJoinedHubsAction();
  const hubs = useHubs.getState().hubs;
  if (hubs) {
    await Promise.all(
      Object.values(hubs).map((hub) => getHubWorkSpacesAction(hub.id))
    );
  }
  const workSpaces = useWorkSpace.getState().workSpaces;
  const allWorkSpaces = workSpaces
    ? Object.values(workSpaces)
        .map((workSpace) => {
          if (workSpace) {
            return Object.keys(workSpace);
          }
        })
        .flat()
    : [];

  if (allWorkSpaces) {
    try {
      await Promise.all(
        allWorkSpaces.map(async (workSpaceId) =>
          getChannelsAction(workSpaceId as WorkSpaceId)
        )
      );
    } catch (error) {
      console.log(error);
    }
  }
};
