import React, { useState, useRef, useEffect } from "react"

import { disconnectSocket, getSocket } from "../utils/socket"

import { Board, CellState } from "../components/Board"
import GamePreviewList from "../components/GamePreviewList"

import styles from "./Game.module.css"


type Player = {
	socketId: string,
	username: string,
}

const ROWS = 20
const COLS = 10

const Game: React.FC = () => {

	const [ lines, setLines ] = useState<number>(0)
	const [ score, setScore ] = useState<number>(0)

	const [ keyPressed, setKeyPressed ] = useState<Boolean>(false)
	const [ previews, setPreviews ] = useState<Map <string, CellState[][]> >(new Map())
	const addPreview = (username: string, board: CellState[][]) => {
		setPreviews((prev) => {
			const updated = new Map(prev)
			updated.set(username, board)
			return updated
		})
	}
	
	const [ board, setBoard ] = useState<CellState[][]>(
		Array.from({length: ROWS}, () => Array(COLS).fill("0"))
	)


	const [nextPiece, setNextPiece ] = useState<CellState[][]>(
		Array.from({length: 2}, () => Array(4).fill("0"))
	)

	const urlParams = window.location.pathname.split("/") 
	const roomName = urlParams[1]
	const playerName = urlParams[2]

	useEffect(() => {
		const handleKeyPressed = (event: KeyboardEvent) => {
			if (keyPressed) {
				return
			}

			const socket = getSocket()
			if (socket === undefined) {
				return
			}

			setKeyPressed(true)
			
			switch (event.key) {
				case "s":
					socket.emit("start_game", {roomName: roomName})
					break
				case "ArrowLeft":
					socket.emit("move", {roomName: roomName, direction: {x: -1, y: 0}})
					break
				case "ArrowRight":
					socket.emit("move", {roomName: roomName, direction: {x: 1, y: 0}})
					break
				case "ArrowUp":
					socket.emit("rotate", {roomName: roomName})
					break
				case "ArrowDown":
					socket.emit("moveToBottom", {roomName: roomName})
					break
				case "r":
					socket.emit("restart_game", {roomName: roomName})
					break
				default:
					break
			}
		}

		const handleKeyUp = () => {
			setKeyPressed(false)
		}

		window.addEventListener("keydown", handleKeyPressed)
		window.addEventListener("keyup", handleKeyUp)
		
		return () => {
			window.removeEventListener("keydown", handleKeyPressed)
			window.removeEventListener("keyup", handleKeyUp)
		}
	}, [keyPressed])

	useEffect(() => {

		const socket = getSocket()
		console.log(socket)
		if (socket === undefined) {
			return
		}
		
	  	socket.on("game_started", (data) => {
			const players = data.players
			if (players === undefined) {
				return
			}

			players.forEach((player: Player) => {
				addPreview(player.username, board)
			})
	  	})
  
	 	socket.on("game_update", (data) => {

			if (data.nextPiece) {
				setNextPiece(data.nextPiece)
			}

			setBoard(data.board)
		})

		socket.on("game_preview", (data) => {
			addPreview(data.player, data.board)
		})

	  	socket.on("game_over", (data) => {
			console.log("Game over")
	 	})

		 socket.on("score_update", (data) => {
			console.log(data)
			setScore(data.score)
			setLines(data.lines)
	 	})
  
		console.log("sending join game")
	  	socket.emit("join_game", {
			roomName: roomName,
			username: "Liam"
		})

		const handleBeforeUnload = () => {
			socket.emit("quit_game", { roomName: roomName})
			if (socket.connected === true) {
				socket.disconnect()
			}
		}

		window.addEventListener("beforeunload", handleBeforeUnload)
  
	  	return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload)
			socket.emit("quit_game", { roomName: roomName})
			disconnectSocket()
	  	}
	}, [])

	return (
		<div className={styles.game}>
			<div className={styles.gamePreviews}>
				<GamePreviewList gamePreviews={previews} />
			</div>
			<div className={styles.gameBoard}>
				<Board cols={COLS} rows={ROWS} board={board} />
			</div>
			<div className={styles.gameSidebar}>
			    <div className={styles.nextPiece}>
				    <p>Next piece:</p>
				    <div style={{width: "50%", maxWidth: "60px"}}>
					    <Board cols={4} rows={4} board={nextPiece} />
				    </div>
			    </div>
			    <div className={styles.score}>
			    	<div style={{display: "flex", justifyContent: "space-between"}}>
			    		<p>Lines:</p>
						<p>{lines}</p>
			    	</div>
			    	<div style={{display: "flex", justifyContent: "space-between"}}>
			    		<p>Score:</p>
						<p>{score}</p>
			    	</div>
			    </div>
			</div>
		</div>
	)
}

export default Game