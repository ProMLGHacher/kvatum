import React, { useState } from "react"
import cls from "./AvatarImagePicker.module.scss"
import Button from "../Button/Button"
export const AvatarImagePicker = () => {
  const [image, setImage] = useState<File | null>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div className={cls.imageRedactor}>
        <div className={cls.imageRedactor__preview}>
          <div className={cls.imageCutRect}></div>
          {image && <img src={URL.createObjectURL(image)} alt="avatar" />}
        </div>
        <div className={cls.imageRedactor__actions}>
          <Button>close</Button>
        </div>
      </div>
    </div>
  )
}
