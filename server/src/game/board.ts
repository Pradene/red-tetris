import { Game } from "./game"
import { Piece } from "./piece"

import { io } from ".."

const COLS: number = 10
const ROWS: number = 20

export class Board {
	game: Game | undefined
	player: string
	board: string[][]
	currentPiece: Piece | undefined
	nextPiece: Piece | undefined
	gamePieceIndex: number
	filled: Boolean = false

    pieceMoveIntervalId: | NodeJS.Timeout | undefined = undefined
    pieceMoveInterval: number = 500

	constructor(player: string)
	constructor(player: string, game?: Game)

	constructor(player: string, game?: Game) {
		this.game = game
		this.player = player
		this.board = Array.from({ length: ROWS }, () => Array(COLS).fill('0'))
		this.gamePieceIndex = 0
	}

	private canBePlaced(position: {x: number, y: number}, shape: string[][]): Boolean {
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
		return this.canBePlaced(position, rotatedShape)
	}

	public rotatePiece() {
		if (!this.currentPiece) {
			const initialized = this.setCurrentPiece()
			if (!initialized) {
				return false
			}
		}

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

		io.to(this.player).emit("game_state", this.getState())

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
		
		return this.canBePlaced({x, y}, piece.shape)
	}

	public movePiece(direction: {x: number, y: number}) {
		if (!this.currentPiece) {
			const initialized = this.setCurrentPiece()
			if (!initialized) {
				return false
			}
		}

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

		io.to(this.player).emit("game_state", this.getState())

		return true
	}

	private copyPieceToBoard(piece: Piece | undefined) {
		const board = this.board.map(row => [...row])

		if (piece !== undefined && piece.position) {
			const { position, shape } = piece

			shape.forEach((row, dy) => {
				row.forEach((cell, dx) => {
					if (cell !== '0') {
						const x = position.x + dx;
						const y = position.y + dy;
	
						if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
							board[y][x] = cell;
						}
					}
				})
			})
		}

		return board
	}

	private savePieceToBoard(piece: Piece) {
		this.board = this.copyPieceToBoard(piece)
	}

	private movePieceDown(): Boolean {
		if (!this.currentPiece) {
			const initialized = this.setCurrentPiece()
			if (!initialized) {
				console.log("Piece cannot be initialized")
				return false
			}
		}
		
		const direction = {x: 0, y: 1}
		if (this.movePiece(direction) === false) {
			const piece = this.currentPiece
			if (piece === undefined) {
				console.log("Piece ubndefined")
				return false
			}

			if (piece.position !== undefined && piece.position.y !== 0) {
				this.savePieceToBoard(piece)
				return this.setCurrentPiece()
				
			} else {
				this.savePieceToBoard(piece)
				return false
			}
		}

		return true
	}

	public movePieceToBottom() {
		while (this.movePieceDown()) {
			continue
		}
	}

	private getNextPiece(): Piece | undefined {
		if (this.game === undefined) {
			return undefined
		}

		const piece: Piece | undefined = this.game.getPieceByIndex(this.gamePieceIndex)
		
		if (piece !== undefined) {
			this.gamePieceIndex += 1
		}

		return piece
	}

	private setCurrentPiece() {
		if (this.nextPiece === undefined) {
			this.nextPiece = this.getNextPiece()
		}

		if (this.nextPiece === undefined) {
			console.error("Cannot get nextPiece")
			return false
		}

		const initialPosition = {
			x: Math.floor(COLS / 2) - Math.floor(this.nextPiece.shape[0].length / 2),
			y: 0
		}
		
		if (!this.canBePlaced(initialPosition, this.nextPiece.shape)) {
			console.log("Piece cannot be placed there")
			return false
		}

		this.nextPiece.position = initialPosition
		this.currentPiece = this.nextPiece
		this.nextPiece = this.getNextPiece()
		return true
	}

	public getShadow() {
		return {
			board: this.board
		}
	}

	public getState() {
		const board = this.copyPieceToBoard(this.currentPiece)
		return { board: board }
	}

	public start() {
		if (this.setCurrentPiece() === false) {
			return
		}

		this.pieceMoveIntervalId = setInterval(() => {
            const canMove = this.movePieceDown()

			if (!canMove) {
				console.log("Game over")
				io.to(this.player).emit("game_over", this.getState())
				clearInterval(this.pieceMoveIntervalId)
				return
			}

			io.to(this.player).emit("game_state", this.getState())

        }, this.pieceMoveInterval)
	}
}