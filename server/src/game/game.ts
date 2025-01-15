import { TetrominoType, TetrominoShapes } from "../types/define"

import { Piece } from "./piece"
import { Player } from "./player"

import { io } from "../socket/io"

const ROWS: number = 20
const COLS: number = 10

export class Game {
	id: string
	started: Boolean = false
	pile: Piece[]
	players: Map<Player, string>
	spectators: Map<string, string>
	host: Player | undefined

	cols: number
	rows: number

	constructor(id: string) {
		this.id = id
		this.pile = []
		this.players = new Map()
		this.spectators = new Map()

		this.cols = COLS
		this.rows = ROWS

		this.initializePile()
	}

	private initializePile(): void {
		this.createPiece(10)
	}

	public addPlayer(username: string, socketId: string): void {
		if (this.started === true) {
			return
		}

		const player = new Player(this, username)
		this.players.set(player, socketId)

		if (this.players.size === 1) {
			this.host = player
		}
	}

	public removePlayer(socketId: string) {
		const player = this.getPlayerBySocketId(socketId)
		if (player === undefined) {
			return
		}

		player.pause()
		this.players.delete(player)
	}

	public getSocketIdByPlayer(player: Player): string | undefined {
		return this.players.get(player)
	}

	public getPlayerBySocketId(socketId: string): Player | undefined {
		for (const [player, id] of this.players) {
			if (id === socketId) {
				return player
			}
		}

		return undefined
	}

	public sendGameStateUpdate(player: Player, data: any): void {
		const socketId = this.getSocketIdByPlayer(player)
		if (socketId === undefined) {
			return
		}

		io.to(socketId).emit("game_update", data)
	}

	public sendGamePreview(data: any) {
		io.to(this.id).emit("game_preview", data)
	}

	public sendScoreUpdate(data: any) {
		io.to(this.id).emit("score_update", data)
	}

	public sendGameOver(data: any) {

	}

	public sendGameStarted() {
		const players = Array.from(this.players.keys()).map((player) => ({
			username: player.username
		}))

		io.to(this.id).emit("game_started", {
			gameId: this.id,
			players: players,
		})
	}

	private createPiece(count: number = 1): void {
		for (let i = 0; i < count; i++) {
			const types = Object.values(TetrominoType) as TetrominoType[]
    		const randomType = types[Math.floor(Math.random() * types.length)]
			const shape = TetrominoShapes[randomType]
			const defaultPosition = {
				x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
				y: -shape.length,
			}
			this.pile.push(new Piece(randomType, defaultPosition))
		}
	}

	public getPieceByIndex(index: number): Piece {
		// Prevent piece index from being negative or too high
		index = Math.abs(index) % 2000

		while (index >= this.pile.length) {
			this.createPiece()
		}

		const piece =  this.pile[index].clone()
		return piece
	}

	public start() {
		if (this.started === true) {
			return
		}

		this.started = true
		this.sendGameStarted()

		for (const [player] of this.players) {
			player.start()
		}
	}

	public restart() {
		for (const [player] of this.players) {
			player.restart()
		}
	}

	public end() {
		for (const [player] of this.players) {
			player.pause()
		}

		this.started = false
		this.players.clear()
		this.spectators.clear()
		this.pile = []
	}
}
