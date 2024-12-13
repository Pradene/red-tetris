import React, { useState, useEffect } from "react"
import { Socket } from "socket.io-client"
import { getSocket, sendSocketMessage } from "../utils/socket"

import { Board } from "../components/Board"
import { CellState } from "../components/Cell"
import GamePreviewList from "../components/GamePreviewList"

import styles from "./Game.module.css"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"


type Player = {
	socketId: string,
	username: string,
}

const ROWS = 20
const COLS = 10

const Game: React.FC = () => {
	const user = useSelector((state: RootState) => state.auth.user)

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
					socket?.emit("start_game", {roomName: roomName})
					break
				case "ArrowLeft":
					socket?.emit("move", {roomName: roomName, direction: {x: -1, y: 0}})
					break
				case "ArrowRight":
					socket?.emit("move", {roomName: roomName, direction: {x: 1, y: 0}})
					break
				case "ArrowUp":
					socket?.emit("rotate", {roomName: roomName})
					break
				case "ArrowDown":
					socket?.emit("moveToBottom", {roomName: roomName})
					break
				case "r":
					socket?.emit("restart_game", {roomName: roomName})
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
		const setupSocketListeners = (socket: Socket) => {
			console.log("Setting up socket listeners")
	
			socket.on("game_started", (data: any) => {
				const players = data.players
				if (!players) return
	
				players.forEach((player: Player) => {
					addPreview(player.username, board)
				})
			})
	
			socket.on("game_update", (data: any) => {
				if (data.nextPiece) {
					setNextPiece(data.nextPiece)
				}
	
				setBoard(data.board)
			})
	
			socket.on("game_preview", (data: any) => {
				addPreview(data.player, data.board)
			})
	
			socket.on("game_over", (data: any) => {
				console.log("Game over")
			})
	
			socket.on("score_update", (data: any) => {
				setScore(data.score)
				setLines(data.lines)
			})
	
			console.log("Sending join game")
			sendSocketMessage("join_game", { roomName: roomName })
		}
	
		// Ensure socket is connected before adding listeners
		const socket = getSocket()
		if (!socket) {
			console.log("Socket not initialized. Waiting...")
			const interval = setInterval(() => {
				const currentSocket = getSocket()
				if (currentSocket) {
					console.log("Socket initialized. Setting up listeners.")
					clearInterval(interval)
					setupSocketListeners(currentSocket)
				}
			}, 200) // Check every 100ms

		} else {
			setupSocketListeners(socket)
		}
	
		// Handle window unload to notify the server
		const handleBeforeUnload = () => {
			sendSocketMessage("quit_game", { roomName: roomName })
		}
		
		window.addEventListener("beforeunload", handleBeforeUnload)
		
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload)
			sendSocketMessage("quit_game", { roomName: roomName })
		}
	}, [])

	return (
		<div className={styles.game}>
			<div className={styles.gamePreviews}>
				<GamePreviewList gamePreviews={previews} />
			</div>
			<div className={styles.gameBoard}>
				<div className={styles.gameContainer}>
					<Board cols={COLS} rows={ROWS} board={board} />
				</div>
			</div>
			<div className={styles.gameSidebar}>
			    <div className={styles.nextPiece}>
				    <p style={{margin: "0"}}>Next piece:</p>
				    <div style={{width: "25%", maxWidth: "120px"}}>
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