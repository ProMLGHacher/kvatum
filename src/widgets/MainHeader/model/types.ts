export type ServerState = {
    serverId: string | null,
    setServerId: (server: string | null) => void,
}