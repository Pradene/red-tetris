import { Game } from "./game"
import { Piece } from "./piece"
import { Player } from "./player"

const COLS: number = 10
const ROWS: number = 20

export class Board {
	private game: Game
	private player: Player
	private pile: string[][]
	private currentPiece: Piece
	private nextPiece: Piece
	private gamePieceIndex: number
	private rowsRemoved: number = 0
	public  over: Boolean = false

	private pieceMoveIntervalId: | NodeJS.Timeout | undefined = undefined
	private pieceMoveInterval: number = 500

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

		this.game.sendGameStateUpdate(this.player, {
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

		this.game.sendGameStateUpdate(this.player, {
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

	private savePieceToBoard(piece: Piece): void {
		this.pile = this.copyPieceToBoard(piece)

		const removedLines = this.removeLines()
		if (removedLines > 0) {
			this.player.updateScore(removedLines)

			this.game.sendScoreUpdate({
				player: this.player.username,
				score: this.player.score,
				lines: this.rowsRemoved
			})
		}

		// Send preview to all users of the game
		this.game.sendGamePreview({
			player: this.player.username,
			board: this.getPreview()
		})
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

		this.game.sendGameStateUpdate(this.player, {
			board: this.getState(),
			nextPiece: this.nextPiece.shape
		})

		this.startPieceInterval()

		return true
	}

	public getPreview(): string[][] {
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

	private startPieceInterval(): void {
		this.pieceMoveIntervalId = setInterval(() => {
			this.movePieceDown()
		}, this.pieceMoveInterval)
	}

	private stopPieceInterval(): void {
		clearInterval(this.pieceMoveIntervalId)
	}

	public start(): void {
		if (this.over === true) {
			return
		}

		this.stopPieceInterval()
		this.startPieceInterval()
	}

	public stop(): void {
		this.stopPieceInterval()
	}

	public restart(): void {
		this.stopPieceInterval()

		this.over = false
		this.rowsRemoved = 0
		this.gamePieceIndex = 0
		this.currentPiece = this.getNextPiece()
		this.nextPiece = this.getNextPiece()

		this.pile = Array.from({ length: ROWS }, () => Array(COLS).fill('0'))
		this.start()
	}
}
