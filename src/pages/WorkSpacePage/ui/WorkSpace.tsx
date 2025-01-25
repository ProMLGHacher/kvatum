import { WorkSpacesList } from "@/features/workSpaces/ui/WorkSpacesList/WorkSpacesList";
import cls from "./WorkSpace.module.scss";
import { useParams, Outlet } from "react-router-dom";
import { HubParamsIds } from "@/features/hubs/";
import { useWorkSpace } from "@/entities/useWorkSpcae";

export const WorkSpacePage = () => {
  const { workspaceId, hubId } = useParams<HubParamsIds>();
  const { workSpaces } = useWorkSpace();

  if (!hubId) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Произошло чтото непредвиденное. Перезайдите в приложение</h1>
      </div>
    );
  }

  return (
    <div className={cls.serversPage}>
      <aside className={cls.serverSidebar}>
        <WorkSpacesList />
      </aside>
      {workspaceId ? (
        <Outlet />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <h1>Вы не выбрали рабочую область</h1>
        </div>
      )}
    </div>
  );
};
