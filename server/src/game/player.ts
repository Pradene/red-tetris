import { Board } from "./board"
import { Game } from "./game"

export class Player {
    username: string
    score: number = 0
    board: Board

    constructor(game: Game, username: string) {
        this.username = username
        this.board = new Board(game, this)
    }

    public updateScore(removedLines: number): void {
		const baseScore = 100
		const lineMultiplier = Math.pow(2, removedLines - 1)
		const score = baseScore * lineMultiplier

		this.score += score
	}

    public moveToBottom() {
        if (this.board.over) {
            return
        }
        
        this.board.movePieceToBottom()
    }

    public move(direction: {x: number, y:number}) {
        if (this.board.over) {
            return
        }

        this.board.movePiece(direction)
    }

    public rotate() {
        if (this.board.over) {
            return
        }

        this.board.rotatePiece()
    }

    public stop() {
        this.board.stop()
    }
}