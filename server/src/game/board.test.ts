import { Game } from "./game"
import { Board } from "./board"
import { Player } from "./player"
import { Piece } from "./piece"

describe('Board class', () => {
	it('Addiing players in game', () => {
		const id = "hello"
		const game = new Game(id)

		game.addPlayer("user1", "socket1")
		expect(game.players.size).toEqual(1)

		game.addPlayer("user2", "socket2")
		expect(game.players.size).toEqual(2)
	})
})