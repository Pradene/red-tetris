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
        if (removedLines < 1 || removedLines > 4) {
            return
        }

        const baseScore = 100
		const score = ((baseScore * 2 * removedLines) - baseScore)
        + (Math.floor(removedLines / 4) * baseScore)

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

    public start() {
        this.board.start()
    }

    public stop() {
        this.board.stop()
    }

    public restart() {
        this.board.restart()
    }
}