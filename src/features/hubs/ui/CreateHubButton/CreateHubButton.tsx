import { PopUp } from "@/shared/ui/PopUp/PopUp/PopUp";
import cls from "./CreateHubButton.module.scss";
import { useState } from "react";
import Button from "@/shared/ui/Button/Button";
import Input from "@/shared/ui/Input/Input";
import { createHubAction } from "../../model/createHub/createHub";

export const CreateHubButton = () => {
  const [isOpenCreateHubModal, setIsOpenCreateHubModal] = useState(false);
  const [hubName, setHubName] = useState("");

  const handleCreateHub = async () => {
    if (!hubName.trim()) return;
    await createHubAction({ name: hubName });
    setIsOpenCreateHubModal(false);
    setHubName("");
  };

  return (
    <>
      <PopUp
        isOpened={isOpenCreateHubModal}
        onClose={() => setIsOpenCreateHubModal(false)}
      >
        <div className={cls.createHub}>
          <h2>Create Hub</h2>
          <p>Create a new hub to start collaborating with your team.</p>
          <Input
            value={hubName}
            style={{}}
            onChange={(e) => setHubName(e.target.value)}
            placeholder="Enter hub name"
          />
          <Button onClick={handleCreateHub}>Create Hub</Button>
        </div>
      </PopUp>
      <button
        className={cls.createHubButton}
        onClick={() => setIsOpenCreateHubModal(true)}
      >
        +
      </button>
    </>
  );
};
