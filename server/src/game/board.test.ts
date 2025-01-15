import { Game } from "./game";
import { Board } from "./board";
import { Player } from "./player";
import { Piece } from "./piece";

describe('Board class', () => {
	let id: string;
	let game: Game;

	beforeAll(() => {
		id = "Hello";
		game = new Game(id);
		game.addPlayer("user", "socket");
	});

	afterAll(() => {
		game.end();
	});


	it('Addiing player in game', () => {
		expect(game.players.size).toEqual(1);
	});

	it('should block lines', () => {
		const blockedRow = Array(10).fill("X");
		const player = game.getPlayerBySocketId("socket")!;
		player.board.blockLines(1);

		const pile = player.board.getBoard();
		const index = pile.length - 1;
		expect(pile[index]).toEqual(blockedRow);
	})
})
