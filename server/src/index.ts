import express, { Request, Response, NextFunction } from "express"
import path from "path"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const CLIENT_BUILD_FOLDER = path.join(__dirname, '../../client/build')

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}))

if (process.env.MODE === "production") {
    app.use(express.static(CLIENT_BUILD_FOLDER))
}

app.get('*', (req: Request, res: Response) => {
    if (process.env.MODE === "production") {
        res.sendFile(path.join(CLIENT_BUILD_FOLDER, '/index.html'))

    } else {
        res.send('React app is not built yet.')

    }
})

io.on('connection', (socket) => {
    console.log(`A new user connected: ${socket.id}`)

    socket.on('message', (data) => {
        console.log(`Message from ${socket.id}:`, data)
        io.emit('message', data)
    })
    
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconneted`)
    })
})

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})