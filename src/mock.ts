export const servers = [
  {
    id: "1",
    name: "Server 1",
    description: "Description 1",
    image: "https://placehold.co/60x60",
    workSpaces: [
      {
        id: "1",
        name: "WorkSpace 1",
        description: "Description 1",
        image: "https://placehold.co/60x60",
      },
    ],
  },
  {
    id: "2",
    name: "Server 2",
    description: "Description 2",
    image: "https://placehold.co/60x60",
    workSpaces: [
      {
        id: "2",
        name: "WorkSpace 1",
        description: "Description 1",
        image: "https://placehold.co/60x60",
      },
    ],
  },
  {
    id: "3",
    name: "Server 3",
    description: "Description 3",
    image: "https://placehold.co/60x60",
    workSpaces: [
      {
        id: "3",
        name: "WorkSpace 1",
        description: "Description 1",
        image: "https://placehold.co/60x60",
        channels: [
          {
            id: "1",
            name: "Channel 1",
            type: "text",
            pinned: false,
            description: "Description 1",
            image: "https://placehold.co/60x60",
          },
          {
            id: "2",
            name: "Channel 2",
            type: "voice",
            pinned: false,
            description: "Description 2",
            image: "https://placehold.co/60x60",
          },
          {
            id: "3",
            name: "Channel 3",
            type: "text",
            pinned: true,
            description: "Description 3",
            image: "https://placehold.co/60x60",
          },
        ],
      },
      {
        id: "4",
        name: "WorkSpace 2",
        description: "Description 2",
        image: "https://placehold.co/60x60",
      },
      {
        id: "5",
        name: "WorkSpace 3",
        description: "Description 3",
        image: "https://placehold.co/60x60",
      },
    ],
  },
]

export const messages = [
  {
    id: "1",
    channelId: "1",
    workspaceId: "3",
    serverId: "3",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    image: null,
    video: null,
    audio: null,
    file: null,
    type: "text",
    pinned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: "1",
      name: "Owner 1",
      image: "https://placehold.co/60x60",
    },
  },
  {
    id: "2",
    channelId: "3",
    workspaceId: "3",
    serverId: "3",
    text: "uwuw",
    image: null,
    video: null,
    audio: null,
    file: null,
    type: "text",
    pinned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: "2",
      name: "Owner 2",
      image: "https://placehold.co/60x60",
    },
  },
]

export const chats = [
  {
    id: "1",
    name: "Chat 1",
    description: "Description 1",
    image: "https://placehold.co/60x60",
  },
  {
    id: "2",
    name: "Chat 2",
    description: "Description 2",
    image: "https://placehold.co/60x60",
  },
  {
    id: "3",
    name: "Chat 3",
    description: "Description 3",
    image: "https://placehold.co/60x60",
  },
]
