import express, { Request, Response } from "express"
import path from "path"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"

import { Game } from "./game/game"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const server = http.createServer(app)
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
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

const games: Map<number, Game> = new Map()
let gameIdCounter = 0

io.on('connection', (socket) => {
    console.log(`A new user connected: ${socket.id}`)
    const id = ++gameIdCounter

    socket.join(`game_${id}`)

    socket.on('create_game', () => {
        console.log(`Game created with ID: ${id}`)

        const game = new Game(id)
        games.set(id, game)

        game.addPlayer(socket.id)
        game.start()
    })

    socket.on('move', (data) => {
        if (data.direction === undefined) {
            return
        }

        const game = games.get(id)
        game?.move(socket.id, data.direction)
    })

    socket.on('rotate', () => {
        const game = games.get(id)
        game?.rotate(socket.id)
    })

    socket.on('moveToBottom', () => {
        const game = games.get(id)
        game?.moveToBottom(socket.id)
    })
    
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconneted`)
    })
})

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})