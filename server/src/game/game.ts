import { Board } from "./board"
import { Piece } from "./piece"

import { io } from "../index"

export interface Player  {
    socketId: string,
    username: string
}

export class Game {
    id: number
    started: Boolean = false
    pile: Piece[]
    players: Player[]
    boards: Map<string, Board>

    constructor(id: number) {
        this.id = id
        this.pile = []
        this.players = []
        this.boards = new Map()

        this.initializePile()
    }

    private initializePile(): void {
        this.createPiece(10)
    }
    
    public addPlayer(socketId: string): void {
        console.log(`User ${socketId} try to connect to game`)

        if (this.started === true) {
            return
        }

        const player = {
            socketId: socketId,
            username: "Nerdpae"
        }

        this.players.push(player)
        const board = new Board(this, player)
        this.boards.set(socketId, board)
    }

    public getPlayerByUsername(username: string): Player | undefined {
        return this.players.find((player) => player.username === username)
    }

    public getPlayerBySocketId(socketId: string): Player | undefined {
        return this.players.find((player) => player.socketId === socketId)
    }

    public sendGameStateUpdate(socketId: string, data: any): void {
        const player = this.getPlayerBySocketId(socketId)
        if (player === undefined) {
            return
        }

        io.to(player.socketId).emit("game_update", data)
    }

    public sendGamePreview(data: any) {
        io.to(`game_${this.id}`).emit("game_preview", data)
    }

    public sendScoreUpdate(data: any) {
        io.to(`game_${this.id}`).emit("score_update", data)
    }

    public start() {
        io.to(`game_${this.id}`).emit("game_started", {
            gameId: this.id,
            players: this.players,
        })

        this.initializePile()
        this.started = true

        for (let [socketId, board] of this.boards) {
            board.start()
        }
    }

    public moveToBottom(socketId: string) {
        const board = this.boards.get(socketId)
        if (board?.over) {
            return
        }
        
        board?.movePieceToBottom()
    }

    public move(socketId: string, direction: {x: number, y:number}) {
        const board = this.boards.get(socketId)
        if (board?.over) {
            return
        }

        board?.movePiece(direction)
    }

    public rotate(socketId: string) {
        const board = this.boards.get(socketId)
        if (board?.over) {
            return
        }

        board?.rotatePiece()
    }

    private createPiece(count: number = 1): void {
        for (let i = 0; i < count; i++) {
            this.pile.push(Piece.random())
        }
    }

    public getPieceByIndex(index: number): Piece {
        index = Math.abs(index)

        while (index >= this.pile.length) {
            this.createPiece()
        }

        return this.pile[index]
    }
}
