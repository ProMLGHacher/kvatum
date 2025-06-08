export const websocketPinger = (ws: WebSocket, signal?: AbortSignal) => {
  const sendPing = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          eventType: "Ping",
        }),
      )
    }
  }

  const intervalId = setInterval(sendPing, 3000)
  signal?.addEventListener("abort", () => {
    clearInterval(intervalId)
  })
}
