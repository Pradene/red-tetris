import { Game } from "./game"
import { Piece } from "./piece"

import { io } from ".."

import { Player } from "./game"

const COLS: number = 10
const ROWS: number = 20

export class Board {
	game: Game
	player: Player
	pile: string[][]
	currentPiece: Piece
	nextPiece: Piece
	gamePieceIndex: number
	over: Boolean = false
	rowsRemoved: number = 0

    pieceMoveIntervalId: | NodeJS.Timeout | undefined = undefined
    pieceMoveInterval: number = 500

	constructor(game: Game, player: Player) {
		this.game = game

		this.gamePieceIndex = 0
		this.currentPiece = this.getNextPiece()
		this.nextPiece = this.getNextPiece()

		this.player = player
		this.pile = Array.from({ length: ROWS }, () => Array(COLS).fill('0'))
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
					((ny >= 0) === (ny >= 0 && this.pile[ny][nx] === '0'))
				)
			})
		})	
	}

	private canRotatePiece(piece: Piece ): Boolean {
		const position: {x: number, y: number} | undefined = piece.position
		if (position === undefined) {
			return false
		}

		const rotatedShape = piece.getRotatedShape()
		return this.canBePlaced(position, rotatedShape)
	}

	private canMovePiece(piece: Piece, direction: {x: number, y: number}): Boolean {
		const position: {x: number, y: number} | undefined = piece.position
		if (position === undefined) {
			return false
		}

		const x = position.x + direction.x
		const y = position.y + direction.y

		return this.canBePlaced({x, y}, piece.shape)
	}

	private movePieceDown(): Boolean {
		const direction = {x: 0, y: 1}
		if (this.movePiece(direction) === false) {

			this.savePieceToBoard(this.currentPiece)
			clearInterval(this.pieceMoveIntervalId)

			if (this.setCurrentPiece() === false) {
				console.log("Game over")
				this.over = true
					
				io.to(this.player.socketId).emit("game_over", {
					board: this.getState()
				})
			}

			return false
		}

		return true
	}


	// Game movements


	public movePieceToBottom(): void {
		while (this.movePieceDown())
			continue
	}

	public rotatePiece(): Boolean {
		const piece = this.currentPiece
		const position: {x: number, y: number} | undefined = piece.position
		
		if (position === undefined) {
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

	public movePiece(direction: {x: number, y: number}): Boolean {
		const piece = this.currentPiece
		const position: {x: number, y: number} | undefined = piece.position
		
		if (position === undefined) {
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
		const rowsRemaining = this.pile.filter((row) => row.some((cell) => cell === "0"))
		const rowsRemoved = ROWS - rowsRemaining.length
		const rowsEmpty = Array.from({length: rowsRemoved}, () => emptyRow)
		
		this.rowsRemoved += rowsRemoved
		this.pile = [...rowsEmpty, ...rowsRemaining]
		return rowsRemoved
	}

	private copyPieceToBoard(piece: Piece): string[][] {
		const pile = this.pile.map(row => [...row])

		if (piece.position !== undefined) {
			const { position, shape } = piece

			shape.forEach((row, dy) => {
				row.forEach((cell, dx) => {
					if (cell !== '0') {
						const x = position.x + dx;
						const y = position.y + dy;
	
						if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
							pile[y][x] = cell;
						}
					}
				})
			})
		}

		return pile
	}

	private notifyPlayers(): void {
		const id = `game_${this.game.id}`
		io.to(id).emit('game_preview', {
			board: this.getShadow(),
			player: this.player
		})
	}

	private savePieceToBoard(piece: Piece): void {
		this.pile = this.copyPieceToBoard(piece)
		
		if (this.removeLines()) {
			io.to(this.player.socketId).emit("score", {
				lines: this.rowsRemoved
			})
		}

		this.notifyPlayers()
	}

	private getNextPiece(): Piece {
		const piece: Piece = this.game.getPieceByIndex(this.gamePieceIndex)
		this.gamePieceIndex += 1

		return piece
	}

	private setCurrentPiece(): Boolean {
		const initialPosition = {
			x: Math.floor(COLS / 2) - Math.floor(this.nextPiece.shape[0].length / 2),
			y: -(this.nextPiece.shape.length - 1)
		}
		
		if (!this.canBePlaced(initialPosition, this.nextPiece.shape)) {
			return false
		}

		this.nextPiece.position = initialPosition
		this.currentPiece = this.nextPiece
		this.nextPiece = this.getNextPiece()

		io.to(this.player.socketId).emit("game_state", {
			board: this.getState(),
			nextPiece: this.nextPiece?.shape
		})

		this.startPieceInterval()

		return true
	}

	private startPieceInterval(): void {
		this.pieceMoveIntervalId = setInterval(() => {
            this.movePieceDown()
        }, this.pieceMoveInterval)
	}

	public getShadow(): string[][] {
		let tmp = Array(COLS).fill("0")

		const shadow = this.pile.map((row) => {
			return row.map((cell, index) => {
				if (cell !== "0" || tmp[index] !== "0") {
					tmp[index] = "L"
				}
				
				return tmp[index]
			})
		})

		return shadow
	}

	public getState(): string[][] {
		const board = this.copyPieceToBoard(this.currentPiece)
		return board
	}

	public start(): void {
		this.startPieceInterval()
	}
}