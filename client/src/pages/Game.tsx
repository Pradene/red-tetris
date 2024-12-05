import React, { useState, useRef, useEffect } from "react"

import socket from "../utils/socket"

interface CellProps {
	size: number,
	color: string
}

type CellState = "J" | "L" | "O" | "T" | "I" | "Z" | "S" | "0"

const Cell: React.FC<CellProps> = React.memo(({size, color}) => {
	return (
		<div
			style={{
				width: `${size}px`,
				height: `${size}px`,
				backgroundColor: color,
				border: 'none',
				borderRadius: '2px',
				transition: 'backgound-color 0.2s'
			}} 
		/>
	)
}, (prevProps: CellProps, nextProps: CellProps) => prevProps.color === nextProps.color)

const COLS = 10
const ROWS = 20

const Board: React.FC = () => {

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
		console.log("Received message:", data)
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

	const cellSize = 24

	const getColorForCell = (type: CellState) => {
		// Define color mappings for each theme
		const colorMapping: Record<CellState, string> = {
			"J": "#6F1D1B",
			"L": "#F7C548",
			"O": "#2B50AA",
			"T": "#2B50AA",
			"I": "darkcyan",
			"Z": "darkred",
			"S": "darkgreen",
			"0": "red",
		}
		
		// Return color based on the current theme
		return colorMapping[type] || "red"
	}

	return (
		<div style={{ 
			display: "grid",
			gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
			gap: "1px" }}
		>
			{board.flatMap((row, rowIndex) =>
				row.map((cell, colIndex) => (
					<Cell
			  			key={`${rowIndex * COLS + colIndex}`}
			  			size={cellSize}
			  			color={getColorForCell(cell)} // Pass the color dynamically based on the cell state
					/>
		  		))
			)}
	  </div>
	)
}

const Game: React.FC = () => {
	return (
		<div>
			<Board />
		</div>
	)
}

export default Game