import { io, Socket } from "socket.io-client"

let socket: Socket | undefined = undefined


export const connectSocket = () => {
    const url = "http://localhost:5000"
    socket = io(url, {
        auth: {
            token: "token"
        }
    })
    
    console.log(socket)

    return socket
}

export const getSocket = () => {
    return socket
}

export const disconnectSocket = () => {
    if (socket !== undefined) {
        socket.disconnect()
        socket = undefined
    }
}