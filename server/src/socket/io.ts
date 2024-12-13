import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken"

import { Server } from "socket.io"
import { server } from "../server"
import { registerSocketHandlers } from "./handlers"

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

io.use((socket, next) => {
	const cookies = socket.handshake.headers.cookie

	if (!cookies) {
		console.error('No cookies found')
		return next(new Error('Authentication failed'))
	}

	// Parse cookies manually or use cookie parsing method
	const cookieObj = Object.fromEntries(
		cookies.split('; ').map(cookie => {
			const [name, value] = cookie.split('=')
			return [name, decodeURIComponent(value)]
		})
	)

	const token = cookieObj.accessToken

	if (!token) {
		console.error('Authentication token missing')
		return next(new Error('Authentication token missing'))
	}

	jwt.verify(token, process.env.JWT_SECRET!, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
		if (err) {
			return next(new Error("Invalid or expired token"))
		}

		if (decoded && typeof decoded === "object") {
			socket.data.user = decoded as User
			next()

		} else {
			next(new Error("Invalid token payload"))
		}
	})
})

io.on("connection", (socket) => {
	console.log(`User connected: ${socket.data.user.username} with socket ${socket.id}`)
	registerSocketHandlers(io, socket)
})