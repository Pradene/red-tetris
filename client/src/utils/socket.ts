import { io, Socket } from "socket.io-client"

let socket: Socket | null = null
let messageQueue: {type: string, message: any}[] = []
let isConnected: Boolean = false

export const connectSocket = () => {
    if (socket) {
        return socket
    }

    const url = "http://localhost:5000"
    socket = io(url, {
        withCredentials: true,
    })

    socket.on("connect", () => {
        isConnected = true

        console.log("connected, sending messages", messageQueue)

        while (messageQueue.length > 0) {
            const {type, message} = messageQueue.shift()!
            sendSocketMessage(type, message)
        }
    })

    socket.on("error", () => {
        console.log("Socket error")
        socket?.close()
    })

    socket.on("disconnect", () => {
        isConnected = false
        socket = null

        console.log("Disconnect user")
    })

    return socket
}

export const getSocket = () => {
    return socket
}

export const sendSocketMessage = (type: string, message: any) => {
    console.log("sending message")
    if (isConnected && socket) {
        console.log("emit")
        socket.emit(type, message)
    } else {
        console.log("WebSocket not ready. Queuing message:", type, message)
        messageQueue.push({type, message})
        console.log(messageQueue.length)
    }
}