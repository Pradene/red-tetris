import { Player } from "./player"
import { Game } from "./game"

describe("Player class", () => {

	let id: string
	let game: Game
	let player: Player

	beforeEach(() => {
		id = "Hello"
		game = new Game(id)
		player = new Player(game, "test")
	})

	afterEach(() => {
		game.end()
	})

	it("should add a player to the game", () => {
		game.addPlayer("user", "socketId")
		expect(game.players.size).toEqual(1)
	})

	it("should add score to player", () => {
		player.updateScore(0)
		expect(player.score).toEqual(0)

		player.updateScore(1)
		expect(player.score).toEqual(100)

		player.updateScore(2)
		expect(player.score).toEqual(100 + 300)

		player.updateScore(3)
		expect(player.score).toEqual(100 + 300 + 500)

		player.updateScore(4)
		expect(player.score).toEqual(100 + 300 + 500 + 800)
	})
})