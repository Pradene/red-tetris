import { Server, Socket } from "socket.io";
import { Game } from "../game/game";


const games: Map<string, Game> = new Map();

export const registerSocketHandlers = (io: Server, socket: Socket) => {

	socket.on('join_game', (data) => {
		const username = socket.data.user.username;
		const { roomName } = data;
		if (roomName === undefined) {
			console.error("Error: you need to provide a username and a room name to join");
			return;
		}

		let game = games.get(roomName);
		if (game === undefined) {
			game = new Game(roomName);
			console.log(`Game ${roomName} created`);
			games.set(roomName, game);
		}

		socket.join(roomName);
		game.addPlayer(username, socket.id);
	});

	socket.on("start_game", (data) => {
		const { roomName } = data;
		if (roomName === undefined) {
			return;
		}

		let game = games.get(roomName);
		game?.start();
	});

	socket.on("restart_game", (data) => {
		const { roomName } = data;
		if (roomName === undefined) {
			return;
		}

		let game = games.get(roomName);
		game?.restart();
	});

	socket.on("quit_game", (data) => {
		console.log("Quit game");
		const { roomName } = data;
		if (roomName === undefined) {
			return;
		}

		const game = games.get(roomName);
		game?.removePlayer(socket.id);
		console.log("Game players", game?.players);

		if (game?.players.size === 0) {
			games.delete(roomName);
		}
	});

	socket.on('move', (data) => {
		const { roomName, direction } = data;
		if (roomName === undefined || direction === undefined) {
			return;
		}

		const game = games.get(roomName);
		const player = game?.getPlayerBySocketId(socket.id);
		player?.move(data.direction);
	});

	socket.on('rotate', (data) => {
		const { roomName } = data;
		if (roomName === undefined) {
			return;
		}

		const game = games.get(roomName);
		const player = game?.getPlayerBySocketId(socket.id);
		player?.rotate();
	});

	socket.on('moveToBottom', (data) => {
		const { roomName } = data;
		if (roomName === undefined) {
			return;
		}

		const game = games.get(roomName);
		const player = game?.getPlayerBySocketId(socket.id);
		player?.moveToBottom();
	});

	socket.on('disconnect', () => {
		console.log(`User ${socket.id} disconneted`);
	});
}