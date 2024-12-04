import { Game } from "./game"
import { Piece } from "./piece"

const COLS: number = 10
const ROWS: number = 20

export class Board {
	game: Game
	board: string[][]
	currentPiece: Piece | undefined
	pieceIndex: number

	constructor(game: Game) {
		this.game = game
		this.board = Array.from({ length: ROWS }, () => Array(COLS).fill('0'))
		this.currentPiece = undefined
		this.pieceIndex = 0
	}

	canMovePiece() {}

	movePiece() {}

	movePieceDown() {}

	getNextPiece() {
		this.currentPiece = this.game.getPieceByIndex(this.pieceIndex)
	}
}