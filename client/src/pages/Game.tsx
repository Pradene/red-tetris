import React, { useState } from "react"

interface CellProps {
	size: number,
	color: string
}

type CellState = "j" | "l" | "o" | "t" | "i" | "z" | "s" | "0"

const Cell: React.FC<CellProps> = ({size, color}) => {
	return (
		<div
			style={{
				width: `${size}px`,
				height: `${size}px`,
				backgroundColor: color,
				border: 'none',
				borderRadius: '2px',
			}} 
		/>
	)
}

const COLS = 10
const ROWS = 20

const Board: React.FC = () => {
	
	// Board initialization
	// Fill all cell from the board with empty state ("0")
	const [board, setBoard] = useState<CellState[][]>(
		Array.from({length: ROWS}, () => Array(COLS).fill("0"))
	)

	const cellSize = 24

	const getColorForCell = (state: CellState) => {
		switch (state) {
			case "0":
				return "blue"
			default:
				return "red"
		}
	}

	return (
		<div style={{ 
			display: "grid",
			gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
			gap: "1px" }}
		>
			{board.map((row, rowIndex) =>
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