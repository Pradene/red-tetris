import React, { useState, useRef, useEffect } from "react"

import socket from "../utils/socket"

import { Board, CellState } from "../components/Board"
import GamePreviewList from "../components/GamePreviewList"

type Player = {
	socketId: string,
	username: string,
}

const ROWS = 20
const COLS = 10

const Game: React.FC = () => {
	const [ keyPressed, setKeyPressed ] = useState<Boolean>(false)

	useEffect(() => {
		const handleKeyPressed = (event: KeyboardEvent) => {
			if (keyPressed) {
				return
			}

			setKeyPressed(true)
			
			switch (event.key) {
				case "ArrowLeft":
					socket.emit("move", {direction: {x: -1, y: 0}})
					break
				case "ArrowRight":
					socket.emit("move", {direction: {x: 1, y: 0}})
					break
				case "ArrowUp":
					socket.emit("rotate")
					break
				case "ArrowDown":
					socket.emit("moveToBottom")
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

	// Board initialization
	// Fill all cell from the board with empty state ("0")
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

	const [ score, setScore ] = useState<number>(0)

	const [nextPiece, setNextPiece ] = useState<CellState[][]>(
		Array.from({length: 2}, () => Array(4).fill("0"))
	)

	const s = useRef(socket)

	useEffect(() => {  
		s.current.connect()
  
		s.current.on("connect", () => {
	  	})
		
	  	s.current.on("game_started", (data) => {
			const players = data.players
			if (players === undefined) {
				return
			}

			players.forEach((player: Player) => {
				addPreview(player.username, board)
			})
	  	})
  
	 	s.current.on("game_update", (data) => {

			if (data.nextPiece) {
				setNextPiece(data.nextPiece)
			}

			setBoard(data.board)
		})

		s.current.on("game_preview", (data) => {
			addPreview(data.player, data.board)
		})

	  	s.current.on("game_over", (data) => {
	 	})

		 s.current.on("score_update", (data) => {
			setScore(data.score)
	 	})
  
	  	s.current.emit("create_game", "Hello you")
  
	  	return () => {
			s.current.disconnect()
	  	}
	}, [])

	return (
		<div className="game">
			<div className="game-previews">
				<GamePreviewList gamePreviews={previews} />
			</div>
			<div className="game-board">
				<Board cols={COLS} rows={ROWS} board={board} />
			    <div className="game-sidebar">
				    <div className="next-piece">
					    <p>Next piece:</p>
					    <div style={{width: "50%", margin: "auto"}}>
						    <Board cols={4} rows={4} board={nextPiece} />
					    </div>
				    </div>
				    <div className="score">
				    	<div>
				    		<p>Lines:</p>
							<div></div>
				    	</div>
				    	<div>
				    		<p>Score:</p>
							<p>{score}</p>
				    	</div>
				    </div>
			    </div>
			</div>
		</div>
	)
}

export default Game