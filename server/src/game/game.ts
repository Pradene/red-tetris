import { Piece } from "./piece"
import { Player } from "./player"

import { io } from "../socket/io"

export class Game {
	id: string
	started: Boolean = false
	pile: Piece[]
	players: Map<Player, string>
	spectators: Map<string, string>

	constructor(id: string) {
		this.id = id
		this.pile = []
		this.players = new Map()
		this.spectators = new Map()

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
	}

	public removePlayer(socketId: string) {
		const player = this.getPlayerBySocketId(socketId)
		if (player === undefined) {
			return
		}

		player.stop()
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
			this.pile.push(Piece.random())
		}
	}

	public getPieceByIndex(index: number): Piece {
		// Prevent piece index from being negative or too high
		index = Math.abs(index) % 2000

		while (index >= this.pile.length) {
			this.createPiece()
		}

		return this.pile[index].clone()
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
			player.stop()
		}

		this.players.clear()
		this.spectators.clear()
		this.pile = []

	}
}
