import React, { useState, useRef, useEffect } from "react"

import socket from "../utils/socket"

import { Board, CellState } from "../components/Board"
import GamePreviewList from "../components/GamePreviewList"

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
					socket.emit("down")
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
	const [board, setBoard] = useState<CellState[][]>(
		Array.from({length: ROWS}, () => Array(COLS).fill("0"))
	)

	const s = useRef(socket)

	useEffect(() => {  
		s.current.connect()
  
		s.current.on("connect", () => {
			console.log("Connected to socket.io server:", socket.id)
	  	})
		
	  	s.current.on("game_started", (data) => {
			console.log("Received message:", data)
	  	})
  
	 	s.current.on("game_state", (data) => {
			setBoard(data.board)
		})

	  	s.current.on("game_over", (data) => {
			console.log("Game over:", data)
	 	})
  
	  	s.current.emit("create_game", "Hello you")
  
	  	return () => {
			s.current.disconnect()
	  	}
	}, [])

	const [cellSize, setCellSize] = useState(0)

	useEffect(() => {
		const resizeHandler = () => {
		  // Calculate available space for the game board
		  const gridWidth = window.innerWidth * 0.7
		  const gridHeight = window.innerHeight * 0.85
	
		  // Calculate the cell size based on the smaller dimension
		  const maxCellWidth = Math.floor(gridWidth / COLS)
		  const maxCellHeight = Math.floor(gridHeight / ROWS)
		  setCellSize(Math.min(maxCellWidth, maxCellHeight))
		}
	
		// Initial calculation and resize listener
		resizeHandler()
		window.addEventListener("resize", resizeHandler)
		return () => {
			window.removeEventListener("resize", resizeHandler)
		}
	  }, [])

	return (
		<div className="game">
			<div className="score"></div>
			<div className="next-piece"></div>
			<div className="game-board">
				<Board board={board} cellSize={cellSize} />
			</div>
			<div className="game-shadows">
				<GamePreviewList gamePreviews={[
					board, board, board, board, board, board, board,
					board, board, board, board, board, board, board]} />
			</div>
		</div>
	)
}

export default Game