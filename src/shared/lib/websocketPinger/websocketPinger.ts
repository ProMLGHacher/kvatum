export const websocketPinger = (ws: WebSocket, controller: AbortController) => {
    const sendPing = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ eventType: 'ping', eventBody: { timeStamp: Date.now() } }))
        }
    }

    const intervalId = setInterval(sendPing, 3000) // Send ping every 30 seconds
    controller.signal.addEventListener('abort', () => {
        clearInterval(intervalId)
    })
}
