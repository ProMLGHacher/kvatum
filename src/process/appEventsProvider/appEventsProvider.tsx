import { useEventsChannel } from "@/entities/useEventsChannel";
import { useEffect } from "react";
import { AppEvents } from "./types";

export const AppEventsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { eventsChannel } = useEventsChannel();

  useEffect(() => {
    eventsChannel?.addEventListener("message", (event) => {
      const data: AppEvents = JSON.parse(event.data);

      switch (data.type) {
        case "room_created":
          console.log(data.payload);
          break;
        case "room_updated":
          console.log(data.payload);
          break;
      }
    });
  }, [eventsChannel]);

  return children;
};
