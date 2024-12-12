import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken"

import { Server } from "socket.io"
import { server } from "../server"
import { registerSocketHandlers } from "./handlers"

const JWT_SECRET = "123456789"

interface User {
    id: number,
    username: string
}

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

// io.use((socket, next) => {
//     const token = socket.handshake.auth?.token
//     if (!token) {
//         return next(new Error('Authentication token missing'))
//     }

//     jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
//         if (err) {
//             return next(new Error("Invalid or expired token"))
//         }

//         if (decoded && typeof decoded === "object") {
//             socket.data.user = decoded as User
//             next()

//         } else {
//             next(new Error("Invalid token payload"))
//         }
//     })
// })

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)
    registerSocketHandlers(io, socket)
})