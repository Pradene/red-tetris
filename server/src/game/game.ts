import { Board } from "./board"
import { Piece } from "./piece"

import { io } from "../index"

export class Game {
    id: number
    started: Boolean = false
    pile: Piece[]
    players: string[]
    boards: Map<string, Board>
    pieceMoveIntervalId: NodeJS.Timeout | null = null
    pieceMoveINterval: number = 500

    constructor(id: number) {
        this.id = id
        this.pile = []
        this.players = []
        this.boards = new Map()
    }

    initializePile(): void {
        this.createPiece(10)
    }
    
    addPlayer(socketId: string): void {
        console.log(`User ${socketId} try to connect to game`)

        const board = new Board(socketId, this)
        this.players.push(socketId)
        this.boards.set(socketId, board)
        
        if (this.started === false) {
            this.start()
        }
    }
    
    start() {
        console.log(`Starring game ${this.id}`)

        this.started = true
        this.initializePile()

        this.players.forEach((socketId) => {
            console.log(`trying to send a message to user ${socketId}`)
            io.to(socketId).emit("game_started", {
                gameId: this.id,
                message: "Game has started"
            })
        })

        this.pieceMoveIntervalId = setInterval(() => {
            console.log("Sending game state")
            for (let [socketId, board] of this.boards) {
                board.movePieceDown()
                this.sendGameState(socketId)
            }
        }, this.pieceMoveINterval)
    }

    updatePlayer(socketId: string, direction: {x: number, y:number}) {
        const board = this.boards.get(socketId)
        board?.movePiece(direction)
    }

    createPiece(count: number = 1): void {
        for (let index = 0; index < count; index++) {
            this.pile.push(Piece.random())
        }
    }

    getPieceByIndex(index: number): Piece {
        while (index >= this.pile.length) {
            this.createPiece()
        }

        return this.pile[index]
    }

    
	private sendGameState(socketId: string) {
		console.log("Send game state")

        const board = this.boards.get(socketId)
		io.to(socketId).emit('game_state', board?.getState())
	}
}