export const websocketPinger = (ws: WebSocket, controller: AbortController) => {
    const sendPing = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                eventType: 'Ping'
            }))
        }
    }

    const intervalId = setInterval(sendPing, 3000)
    controller.signal.addEventListener('abort', () => {
        clearInterval(intervalId)
    })
}
