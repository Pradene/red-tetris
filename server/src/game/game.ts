import { Board } from "./board"
import { Piece } from "./piece"

import { io } from "../index"

export class Game {
    id: number
    started: Boolean = false
    pile: Piece[]
    players: string[]
    boards: Map<string, Board>

    constructor(id: number) {
        this.id = id
        this.pile = []
        this.players = []
        this.boards = new Map()
    }

    private initializePile(): void {
        this.createPiece(10)
    }
    
    public addPlayer(socketId: string): void {
        console.log(`User ${socketId} try to connect to game`)

        if (this.started === true) {
            return
        }

        const board = new Board(socketId, this)
        this.players.push(socketId)
        this.boards.set(socketId, board)
    }
    
    public start() {
        console.log(`Starting game ${this.id}`)

        this.started = true
        this.initializePile()

        for (let [socketId, board] of this.boards) {
            board.start()
            
            io.to(socketId).emit("game_started", {
                gameId: this.id,
                message: "Game has started"
            })
        }
    }

    public downPlayer(socketId: string) {
        const board = this.boards.get(socketId)
        if (board?.filled) {
            return
        }
        
        board?.movePieceToBottom()
    }

    public movePlayer(socketId: string, direction: {x: number, y:number}) {
        const board = this.boards.get(socketId)
        if (board?.filled) {
            return
        }

        board?.movePiece(direction)
    }

    public rotatePlayer(socketId: string) {
        const board = this.boards.get(socketId)
        if (board?.filled) {
            return
        }

        board?.rotatePiece()
    }

    private createPiece(count: number = 1): void {
        for (let index = 0; index < count; index++) {
            this.pile.push(Piece.random())
        }
    }

    public getPieceByIndex(index: number): Piece {
        while (index >= this.pile.length) {
            this.createPiece()
        }

        return this.pile[index]
    }
}