import { useEffect, useState } from "react";
import { AppRouter } from "./appRouter/AppRouter";
import { configureTokenInterceptors } from "./lib/initTokenInterceptor";
import { getUserAction } from "@/features/user/getUserAction/getUserAction";
import { ContextMenuProvider } from "@/entities/useContextMenu/ui/ContextMenuProvider";
import { ConfControlsProvider } from "@/widgets/ConfControlsProvider/ui/ConfControlsProvider";
import { useSignallingChannel } from "@/entities/useSignallingChannel";
import { configureConferenceSignallingChannel } from "@/features/conference/model/conferenceActionsts";
import { ConferenceAudioProvider } from "@/features/conference/ui/ConferenceAudioProvider/ConferenceAudioProvider";
import { useTokensData } from "@/entities/useTokensData";
import { initHubsDataAction } from "@/features/hubs/model/initHubsData/initHubsData";
import { useEventsChannel } from "@/entities/useEventsChannel";
import { AppEventsProvider } from "@/process/appEventsProvider";

export const App = () => {
  const [loading, setLoading] = useState(true);

  const { accessToken, refreshToken } = useTokensData();

  useEffect(() => {
    const init = async () => {
      configureTokenInterceptors();
      try {
        await getUserAction();
      } catch (error) {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!(accessToken && refreshToken)) {
      useSignallingChannel.getState().close();
      useEventsChannel.getState().close();
      return;
    }
    const init = async () => {
      await initHubsDataAction();
      try {
        await useSignallingChannel.getState().connect();
      } catch (error) {
        console.log(error);
      }
      try {
        await useEventsChannel.getState().connect();
      } catch (error) {
        console.log(error);
      }
      configureConferenceSignallingChannel();
      setLoading(false);
    };
    init();
  }, [accessToken, refreshToken]);

  if (loading) {
    return <div style={{ color: "white" }}>Гружу приложение...</div>;
  }

  return (
    <AppEventsProvider>
      <ContextMenuProvider>
        <ConfControlsProvider>
          <ConferenceAudioProvider>
            <AppRouter />
          </ConferenceAudioProvider>
        </ConfControlsProvider>
      </ContextMenuProvider>
    </AppEventsProvider>
  );
};
