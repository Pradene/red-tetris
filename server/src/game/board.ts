import { Game } from "./game"
import { Piece } from "./piece"

const COLS: number = 10
const ROWS: number = 20

export class Board {
	game: Game | undefined
	board: string[][]
	currentPiece: Piece | undefined
	nextPiece: Piece | undefined
	gamePieceIndex: number

	constructor()
	constructor(game: Game)

	constructor(game?: Game) {
		this.game = game
		this.board = Array.from({ length: ROWS }, () => Array(COLS).fill('0'))
		this.gamePieceIndex = 0

		this.currentPiece = this.getNextPieceOfGame()
		if (this.currentPiece !== undefined) {
			this.currentPiece.position = {x: 5, y: 0}
			this.nextPiece = this.getNextPieceOfGame()
		}
	}

	canMove(position: {x: number, y: number}, shape: string[][]): Boolean {
		return shape.every((row, dy) => {
			return row.every((cell, dx) => {
				if (cell === '0') {
					return true
				}

				const nx: number = position.x + dx
				const ny: number = position.y + dy

				return (
					nx >= 0 && nx < COLS &&
					ny >= 0 && ny < ROWS &&
					this.board[ny][nx] === '0'
				)
			})
		})	
	}

	canRotatePiece(): Boolean {
		const piece: Piece | undefined = this.currentPiece
		const position: {x: number, y: number} | undefined = piece?.position
		if (piece === undefined ||
			position === undefined) {
			return false
		}

		const rotatedShape = piece.getRotatedShape()
		return this.canMove(position, rotatedShape)
	}

	rotatePiece() {
		if (this.currentPiece === undefined ||
			this.currentPiece.position === undefined) {
			return false
		}
		
		if (this.canRotatePiece() === false) {
			return false
		}
			
		this.currentPiece.rotate()
		return true
	}

	canMovePiece(direction: {x: number, y: number}): Boolean {
		const piece: Piece | undefined = this.currentPiece
		const position: {x: number, y: number} | undefined = piece?.position
		
		if (piece === undefined ||
			position === undefined) {
			return false
		}

		const x = position.x + direction.x
		const y = position.y + direction.y
		
		return this.canMove({x, y}, piece.shape)
	}

	movePiece(direction: {x: number, y: number}) {
		if (this.currentPiece === undefined ||
			this.currentPiece.position === undefined) {
			return false
		}
		
		if (this.canMovePiece(direction) === false) {
			return false
		}
			
		this.currentPiece.position.x += direction.x
		this.currentPiece.position.y += direction.y
		return true
	}

	savePieceToBoard(piece: Piece) {
		const position = piece.position
		if (position === undefined) {
			return
		}

		piece.shape.forEach((row, dy) => {
			row.forEach((cell, dx) => {
				if (cell !== '0') {
					const x = position.x + dx
					const y = position.y + dy

					if (x < 0 || x >= COLS ||
						y > 0 || y >= ROWS) {
						return
					}

					this.board[y][x] = cell
				}
			})
		})
	}

	movePieceDown(): Boolean {
		if (this.currentPiece === undefined ||
			this.currentPiece.position == undefined) {
			return false
		}

		const direction = {x: 0, y: 1}
		if (this.movePiece(direction) === false) {
			this.savePieceToBoard(this.currentPiece)
			this.currentPiece = this.getNextPiece()
			this.nextPiece = this.getNextPieceOfGame()

			return false
		}

		this.currentPiece.position.x += direction.x
		this.currentPiece.position.y += direction.y

		return true
	}

	movePieceToBottom() {
		while (this.movePieceDown())
			continue
	}

	getNextPieceOfGame(): Piece | undefined {
		if (this.game === undefined) {
			return undefined
		}

		const piece: Piece | undefined = this.game.getPieceByIndex(this.gamePieceIndex)
		
		if (piece !== undefined) {
			this.gamePieceIndex += 1
		}

		return piece
	}

	getNextPieceOfType(type: string): Piece | undefined {
		const piece =  new Piece(type)
		if (piece === undefined) {
			return undefined
		}
		
		piece.position = {x: 5, y: 0}
		return piece
	}

	getNextPiece() {
		const piece =  Piece.random()
		piece.position = {x: 5, y: 0}
		return piece
	}
}