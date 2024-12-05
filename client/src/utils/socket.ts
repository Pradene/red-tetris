import { io } from "socket.io-client"

const SOCKET_URL = "http://localhost:5000" // Replace with your backend URL if necessary

const socket = io(SOCKET_URL, {
    autoConnect: false, // Prevents automatic connection on import
})

export default socket