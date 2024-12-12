import { disconnect } from "process"
import { io, Socket } from "socket.io-client"

let socket: Socket | null = null
let messageQueue: {type: string, message: any}[] = []
let isConnected: Boolean = false

export const connectSocket = (token: string) => {
    if (socket) {
        return socket
    }

    const url = "http://localhost:5000"
    socket = io(url, {
        auth: {
            token: token
        }
    })

    socket.on("connect", () => {
        isConnected = true
        console.log("connected, sending messages")
        console.log(messageQueue)

        while (messageQueue.length > 0) {
            const {type, message} = messageQueue.shift()!
            sendSocketMessage(type, message)
        }
    })

    socket.on("error", () => {
        socket?.close()
    })

    socket.on("disconnect", () => {
        isConnected = false
        socket = null

        console.log("Disconnect user")
    })

    return socket
}

const disconnectSocket = () => {
    socket?.disconnect()
}

export const getSocket = () => {
    return socket
}

export const sendSocketMessage = (type: string, message: any) => {
    if (isConnected && socket) {
        socket.emit(type, message)
    } else {
        console.log("WebSocket not ready. Queuing message:", type, message)
        messageQueue.push({type, message})
        console.log(messageQueue.length)
    }
}