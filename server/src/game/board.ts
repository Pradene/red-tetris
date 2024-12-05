import { io } from ".."
import { Game } from "./game"
import { Piece } from "./piece"

const COLS: number = 10
const ROWS: number = 20

export class Board {
	game: Game | undefined
	player: string
	board: string[][]
	currentPiece: Piece | undefined
	nextPiece: Piece | undefined
	gamePieceIndex: number


	constructor(player: string)
	constructor(player: string, game?: Game)

	constructor(player: string, game?: Game) {
		this.game = game
		this.player = player
		this.board = Array.from({ length: ROWS }, () => Array(COLS).fill('0'))
		this.gamePieceIndex = 0
	}

	private canMove(position: {x: number, y: number}, shape: string[][]): Boolean {
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

	private canRotatePiece(piece: Piece ): Boolean {
		const position: {x: number, y: number} | undefined = piece.position
		if (piece === undefined ||
			position === undefined) {
			return false
		}

		const rotatedShape = piece.getRotatedShape()
		return this.canMove(position, rotatedShape)
	}

	public rotatePiece() {
		this.getPieces()

		const piece = this.currentPiece
		const position: {x: number, y: number} | undefined = piece?.position
		
		if (piece === undefined ||
			position === undefined) {
			return false
		}
		
		if (this.canRotatePiece(piece) === false) {
			return false
		}
			
		piece.rotate()

		return true
	}

	private canMovePiece(piece: Piece | undefined, direction: {x: number, y: number}): Boolean {
		const position: {x: number, y: number} | undefined = piece?.position
		
		if (piece === undefined ||
			position === undefined) {
			return false
		}

		const x = position.x + direction.x
		const y = position.y + direction.y
		
		return this.canMove({x, y}, piece.shape)
	}

	public movePiece(direction: {x: number, y: number}) {
		this.getPieces()

		const piece = this.currentPiece
		const position: {x: number, y: number} | undefined = piece?.position
		
		if (piece === undefined ||
			position === undefined) {
			return false
		}
		
		if (this.canMovePiece(piece, direction) === false) {
			return false
		}
			
		position.x += direction.x
		position.y += direction.y

		return true
	}

	public savePieceToBoard(piece: Piece) {
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
						y < 0 || y >= ROWS) {
						return
					}

					this.board[y][x] = cell
				}
			})
		})
	}

	public movePieceDown(): Boolean {
		this.getPieces()

		const piece = this.currentPiece
		const position: {x: number, y: number} | undefined = piece?.position
		
		if (piece === undefined ||
			position === undefined) {
			return false
		}

		const direction = {x: 0, y: 1}
		if (this.movePiece(direction) === false) {
			this.savePieceToBoard(piece)

			this.currentPiece = this.nextPiece
			this.nextPiece = this.getNextPieceOfGame()

			return false
		}

		return true
	}

	public movePieceToBottom() {
		while (this.movePieceDown()) {
			continue
		}
	}

	private getNextPieceOfGame(): Piece | undefined {
		if (this.game === undefined) {
			return undefined
		}

		const piece: Piece | undefined = this.game.getPieceByIndex(this.gamePieceIndex)
		
		if (piece !== undefined) {
			this.gamePieceIndex += 1
			piece.position = {x: 5, y: 0}
		}

		return piece
	}

	private getPieces(): void {
		if (this.currentPiece === undefined)  {
			if (this.nextPiece === undefined) {
				this.nextPiece = this.getNextPieceOfGame()
			}

			this.currentPiece = this.nextPiece
			this.nextPiece = this.getNextPieceOfGame()
		}
	}

	public getState() {
		return {
			board: this.board,
			currentPiece: this.currentPiece ? {
				position: this.currentPiece.position,
				shape: this.currentPiece.shape
			} : null
		}
	}
}