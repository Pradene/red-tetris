import React from "react"

import styles from "./Board.module.css"

export type CellState = "J" | "L" | "O" | "T" | "I" | "Z" | "S" | "0"
interface CellProps {
	color: string
}

const Cell: React.FC<CellProps> = ({ color}) => {
	return (
		<div
			style={{backgroundColor: color}}
			className={styles.cell} 
		/>
	)
}

interface BoardProps {
	cols: number,
	rows: number,
    board: CellState[][],
}

export const Board: React.FC<BoardProps> = ({cols, rows, board}) => {


	const standardizeBoard = (board: CellState[][]): CellState[][] => {
		if (board.length === rows && board[0].length === cols) {
			return board
		}

		const standardizedBoard = Array.from({length: rows}, () => 
			Array(cols).fill("0")
		)

		const offsetX = Math.floor((cols - board[0].length) / 2)
		const offsetY = Math.floor((rows - board.length) / 2)

		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[0].length; col++) {
				standardizedBoard[row + offsetY][col + offsetX] = board[row][col]
				
			}
		}

		return standardizedBoard
	}

	const standardizedBoard = standardizeBoard(board)


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
			"0": "transparent",
		}
		
		// Return color based on the current theme
		return colorMapping[type] || "transparent"
	}

	return (
		<div style={{width: "auto", height: "100%"}}>
			<div style={{
				display: "grid",
				height: "100%",
				width: "100%",
				gridTemplateColumns: `repeat(${cols}, 1fr)`,
				gridTemplateRows: `repeat(${rows}, 1fr)`,
			}} >
				{standardizedBoard.map((row, rowIndex) =>
					row.map((cell, colIndex) => (
						<Cell
				  			key={`${rowIndex * cols + colIndex}`}
				  			color={getColorForCell(cell)} // Pass the color dynamically based on the cell state
						/>
			  		))
				)}
			</div>
		</div>
	)
}
