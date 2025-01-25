import { useHubs } from "@/entities/useHub";
import { hubsApi } from "@/entities/useHub/api/hubsApi";

export const getJoinedHubsAction = async () => {
  try {
    const hubs = await hubsApi.getJoinedHubs();
    useHubs.getState().setHubs(hubs);
  } catch (error) {
    console.error(error);
  }
};
