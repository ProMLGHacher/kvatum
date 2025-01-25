import { HubId, useHubs } from "@/entities/useHub";
import { Outlet, useParams } from "react-router-dom";

export const HubsPage = () => {
  const { hubs } = useHubs();
  const { hubId } = useParams<{ hubId: HubId }>();

  if (!hubs) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <h1>Нет хабов</h1>
        <p>
          Создайте хаб, чтобы начать общение или войдите в хаб по
          ссылке-приглашению
        </p>
      </div>
    );
  }

  const hub = hubId ? hubs[hubId] : null;

  if (!hubId) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <h1>Хабы</h1>
        <p>Выберите хаб, чтобы начать общение</p>
      </div>
    );
  }

  if (!hub) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <h1>Хаб не найден</h1>
        <p>Выберите хаб, чтобы начать общение</p>
      </div>
    );
  }

  return <Outlet />;
};
