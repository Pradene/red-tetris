import { Game } from "./game"
import { Piece } from "./piece"
import { Player } from "./player"

const TIMEOUT: number = 500

export class Board {
	private game: Game
	private player: Player
	private pile: string[][]
	private currentPiece: Piece
	private nextPiece: Piece
	private gamePieceIndex: number
	private rowsRemoved: number = 0

	private pieceMoveTimeoutId: NodeJS.Timeout | undefined = undefined
	private pieceMoveTimeout: number = TIMEOUT

	public  over: Boolean = false

	constructor(game: Game, player: Player) {
		this.game = game

		this.gamePieceIndex = 0
		this.currentPiece = this.getNextPiece()
		this.nextPiece = this.getNextPiece()

		this.player = player
		this.pile = Array.from({ length: this.game.rows }, () => Array(this.game.cols).fill('0'))
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
					nx >= 0 && nx < this.game.cols &&
					ny >= -(shape.length) && ny < this.game.rows &&
					((ny >= 0) === (ny >= 0 && this.pile[ny][nx] === '0'))
				)
			})
		})
	}

	private canRotatePiece(piece: Piece ): Boolean {
		const position: {x: number, y: number} | undefined = piece.position

		const rotatedShape = piece.getRotatedShape()
		return this.canBePlaced(position, rotatedShape)
	}

	private canMovePiece(piece: Piece, direction: {x: number, y: number}): Boolean {
		const position: {x: number, y: number} | undefined = piece.position

		const x = position.x + direction.x
		const y = position.y + direction.y
		return this.canBePlaced({x, y}, piece.shape)
	}

	public blockLines(blockedRows: number): void {
		const rows = Array.from({ length: blockedRows }, () => Array(this.game.cols).fill("X"))
		const tmp = this.pile.slice(blockedRows, this.game.rows)

		this.pile = [...tmp, ...rows]
	}

	private removeLines(): number {
		const emptyRow = Array(this.game.cols).fill("0")
		const rowsRemaining = this.pile.filter((row) => row.some((cell) => cell === "0"))
		const rowsRemoved = this.game.rows - rowsRemaining.length
		const rowsEmpty = Array.from({length: rowsRemoved}, () => emptyRow)

		this.rowsRemoved += rowsRemoved
		this.pile = [...rowsEmpty, ...rowsRemaining]
		return rowsRemoved
	}

	private copyPieceToPile(piece: Piece): string[][] {
		const pile = this.pile.map(row => [...row])
		const { position, shape } = piece

		shape.forEach((row, dy) => {
			row.forEach((cell, dx) => {
				if (cell !== '0') {
					const x = position.x + dx
					const y = position.y + dy
					if (x >= 0 && x < this.game.cols && y >= 0 && y < this.game.rows) {
						pile[y][x] = cell
					}
				}
			})
		})

		return pile
	}

	private savePieceToPile(piece: Piece): Boolean {
		this.pile = this.copyPieceToPile(piece)

		return this.currentPiece.position.y > 0
	}

	private getNextPiece(): Piece {
		const piece: Piece = this.game.getPieceByIndex(this.gamePieceIndex)
		this.gamePieceIndex += 1

		return piece
	}

	private setCurrentPiece(): Boolean {
		if (!this.canBePlaced(this.nextPiece.position, this.nextPiece.shape)) {
			return false
		}

		this.currentPiece = this.nextPiece
		this.nextPiece = this.getNextPiece()

		this.game.sendGameStateUpdate(this.player, {
			board: this.getBoard(),
			nextPiece: this.nextPiece.shape
		})

		return true
	}

	public getPreview(): string[][] {
		let tmp = Array(this.game.cols).fill("0")

		return this.pile.map((row, y) => {
			return row.map((cell, x) => {
				if (cell !== "0" || tmp[x] !== "0") {
					tmp[x] = "X"
				}

				return tmp[x]
			})
		})
	}

	public getBoard(): string[][] {
		return this.copyPieceToPile(this.currentPiece)
	}


	// Game movements

	public movePieceToBottom(): void {
		while (this.movePieceDown() === true) {
			continue
		}
	}

	public rotatePiece(): Boolean {
		const piece = this.currentPiece

		if (this.canRotatePiece(piece) === false) {
			return false
		}

		piece.rotate()

		this.game.sendGameStateUpdate(this.player, {
			board: this.getBoard()
		})

		return true
	}

	public movePiece(direction: {x: number, y: number}): Boolean {
		const piece = this.currentPiece
		const position: {x: number, y: number} | undefined = piece.position

		if (this.canMovePiece(piece, direction) === false) {
			return false
		}

		position.x += direction.x
		position.y += direction.y

		this.game.sendGameStateUpdate(this.player, {
			board: this.getBoard()
		})

		return true
	}

	private movePieceDown(): Boolean {
		const direction = {x: 0, y: 1}
		if (this.movePiece(direction) === false) {

			if (this.savePieceToPile(this.currentPiece) === false) {
				console.log("Game over")
				this.over = true

			} else {
				const removedLines = this.removeLines()
				if (removedLines > 0) {
					this.player.updateScore(removedLines)

					this.game.sendScoreUpdate({
						player: this.player.username,
						score: this.player.score,
						lines: this.rowsRemoved
					})
				}
			}

			// Send preview to all users of the game
			this.game.sendGamePreview({
				player: this.player.username,
				board: this.getPreview()
			})

			if (this.setCurrentPiece() === false) {
				console.log("Game over")
				this.over = true
				// this.game.handleGameOver()
			}

			return false
		}

		return true
	}

	private startPieceTimeout(): void {
		const func = () => {

			const start = performance.now()

			if (this.over === true) {
				return
			}

			this.movePieceDown()

			const end = performance.now()
			const elapsedTime = end - start

			const timeout = Math.max(0, this.pieceMoveTimeout - (elapsedTime))
			this.pieceMoveTimeoutId = setTimeout(func, timeout)
		}

		func()
	}

	private stopPieceTimeout(): void {
		clearTimeout(this.pieceMoveTimeoutId)
		this.pieceMoveTimeoutId = undefined
	}

	public start(): void {
		if (this.over === true) {
			return
		}

		this.stopPieceTimeout()
		this.startPieceTimeout()
	}

	public pause(): void {
		this.stopPieceTimeout()
	}

	public restart(): void {
		this.stopPieceTimeout()

		this.over = false
		this.rowsRemoved = 0
		this.gamePieceIndex = 0
		this.currentPiece = this.getNextPiece()
		this.nextPiece = this.getNextPiece()

		this.pile = Array.from({ length: this.game.rows }, () => Array(this.game.cols).fill('0'))
		this.start()
	}
}
