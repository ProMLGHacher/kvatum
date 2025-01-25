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

export const App = () => {
  const [loading, setLoading] = useState(true);

  const { isAuthorized, accessToken, refreshToken } = useTokensData();

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
    if (!(accessToken && refreshToken)) return;
    const init = async () => {
      await initHubsDataAction();
      await useSignallingChannel.getState().connect();
      configureConferenceSignallingChannel();
      setLoading(false);
    };
    init();
  }, [accessToken, refreshToken]);

  if (loading) {
    return (
      <div style={{ color: "white" }}>
        <p>
          {JSON.stringify({
            isAuthorized,
            accessToken,
            refreshToken,
          })}
        </p>
        Гружу приложение...
      </div>
    );
  }

  return (
    <ContextMenuProvider>
      <ConfControlsProvider>
        <ConferenceAudioProvider>
          <AppRouter />
        </ConferenceAudioProvider>
      </ConfControlsProvider>
    </ContextMenuProvider>
  );
};
