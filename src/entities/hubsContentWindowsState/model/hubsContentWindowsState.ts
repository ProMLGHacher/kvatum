import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type ServerContentWindowsState = {
  chatIsOpen: boolean
  conferenceIsOpen: boolean
  setChatIsOpen: (isOpen: boolean) => void
  setConferenceIsOpen: (isOpen: boolean) => void
}

export const hubsContentWindowsState = create<ServerContentWindowsState>()(
  persist(
    (set, get) => ({
      chatIsOpen: true,
      conferenceIsOpen: false,
      setChatIsOpen: (isOpen: boolean) => {
        if (!get().conferenceIsOpen && !isOpen) return
        set({ chatIsOpen: isOpen })
      },
      setConferenceIsOpen: (isOpen: boolean) => {
        if (!get().chatIsOpen && !isOpen) return
        set({ conferenceIsOpen: isOpen })
      },
    }),
    {
      name: "serverContentWindowsState",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
