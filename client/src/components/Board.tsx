import React from "react"

export type CellState = "J" | "L" | "O" | "T" | "I" | "Z" | "S" | "0"
interface CellProps {
	color: string
}

const Cell: React.FC<CellProps> = ({ color}) => {
	return (
		<div
			style={{
				backgroundColor: color,
				border: 'none',
				width: "100%",
				position: "relative",
				aspectRatio: "1",
			}} 
		/>
	)
}

interface BoardProps {
	cols: number,
	rows: number,
    board: CellState[][],
}

export const Board: React.FC<BoardProps> = ({cols, rows, board}) => {


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
				{board.flatMap((row, rowIndex) =>
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
