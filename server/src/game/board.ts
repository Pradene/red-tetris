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

	canMovePiece(direction: {x: number, y: number}) {
		if (this.currentPiece === undefined) return

		const { shape, position } = this.currentPiece
		let { x, y } = position
		x += direction.x
		y += direction.y

		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col] === '0') {
					continue
				}

				const brow = y + row
				const bcol = x + col

				if (brow < 0 || brow > ROWS ||
					bcol < 0 || bcol > COLS) {
					
					return false
				}

				if (this.board[brow][bcol] !== '0') {
					return false
				}
			}
		}

		return true
	}

	movePiece(direction: {x: number, y: number}) {
		if (this.currentPiece === undefined) {
			return false
		}
		
		if (this.canMovePiece(direction) === false) {
			return false
		}
			
		this.currentPiece.position.x += direction.x
		this.currentPiece.position.y += direction.y
		return true
	}

	movePieceDown() {
		const direction = {x: 0, y: 1}
		while (this.movePiece(direction))
			continue
	}

	getNextPiece(): Piece | undefined {
		this.currentPiece = this.game.getPieceByIndex(this.pieceIndex)
		this.pieceIndex += 1
		
		return this.currentPiece
	}
}