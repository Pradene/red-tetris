import { Game } from "./game"
import { Piece } from "./piece"

import { io } from ".."

import { Player } from "./game"

const COLS: number = 10
const ROWS: number = 20

export class Board {
	game: Game | undefined
	player: Player
	board: string[][]
	currentPiece: Piece | undefined
	nextPiece: Piece | undefined
	gamePieceIndex: number
	filled: Boolean = false
	rowsRemoved: number = 0

    pieceMoveIntervalId: | NodeJS.Timeout | undefined = undefined
    pieceMoveInterval: number = 500

	constructor(player: Player)
	constructor(player: Player, game?: Game)

	constructor(player: Player, game?: Game) {
		this.game = game
		this.player = player
		this.board = Array.from({ length: ROWS }, () => Array(COLS).fill('0'))
		this.gamePieceIndex = 0
	}


	// Game utility movements


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
					ny >= -(shape.length) && ny < ROWS &&
					((ny >= 0) === (ny >= 0 && this.board[ny][nx] === '0'))
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
			if (piece !== undefined) {
				this.savePieceToBoard(piece)
				clearInterval(this.pieceMoveIntervalId)
				if (this.setCurrentPiece() === false) {
					this.filled = true
					
					console.log("Game over")
					io.to(this.player.socketId).emit("game_over", {
						board: this.getState()
					})
				}
				
				return false
			}

			return false
		}

		return true
	}


	// Game movements


	public movePieceToBottom() {
		while (this.movePieceDown())
			continue
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

		io.to(this.player.socketId).emit("game_state", {
			board: this.getState()
		})

		return true
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

		io.to(this.player.socketId).emit("game_state", {
			board: this.getState()
		})

		return true
	}

	private removeLines(): number {
		const emptyRow = Array(COLS).fill("0")
		const rowsRemaining = this.board.filter((row) => row.some((cell) => cell === "0"))
		const rowsRemoved = ROWS - rowsRemaining.length
		const rowsEmpty = Array.from({length: rowsRemoved}, () => emptyRow)
		
		this.rowsRemoved += rowsRemoved
		this.board = [...rowsEmpty, ...rowsRemaining]
		return rowsRemoved
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

	private notifyPlayers() {
		if (this.game === undefined) {
			return
		}

		const id = `game_${this.game.id}`
		io.to(id).emit('game_preview', {
			board: this.getShadow(),
			player: this.player
		})
	}

	private savePieceToBoard(piece: Piece) {
		this.board = this.copyPieceToBoard(piece)
		
		if (this.removeLines()) {
			io.to(this.player.socketId).emit("score", {
				lines: this.rowsRemoved
			})
		}

		this.notifyPlayers()
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

	private setCurrentPiece(): Boolean {
		if (this.nextPiece === undefined) {
			this.nextPiece = this.getNextPiece()
		}

		if (this.nextPiece === undefined) {
			console.error("Cannot get nextPiece")
			return false
		}

		const initialPosition = {
			x: Math.floor(COLS / 2) - Math.floor(this.nextPiece.shape[0].length / 2),
			y: -(this.nextPiece.shape.length - 1)
		}
		
		if (!this.canBePlaced(initialPosition, this.nextPiece.shape)) {
			console.log("Piece cannot be placed there")
			return false
		}

		this.nextPiece.position = initialPosition
		this.currentPiece = this.nextPiece
		this.nextPiece = this.getNextPiece()

		io.to(this.player.socketId).emit("game_state", {
			board: this.getState(),
			nextPiece: this.nextPiece?.shape
		})

		this.pieceMoveIntervalId = setInterval(() => {
            this.movePieceDown()
        }, this.pieceMoveInterval)

		return true
	}

	public getShadow() {
		return this.board
	}

	public getState() {
		const board = this.copyPieceToBoard(this.currentPiece)
		return board
	}

	public start() {
		if (this.setCurrentPiece() === false) {
			return
		}
	}
}