import React, { useState, useRef, useEffect } from "react"

import socket from "../utils/socket"

export type CellState = "J" | "L" | "O" | "T" | "I" | "Z" | "S" | "0"
interface CellProps {
	size: number,
	color: string
}

const Cell: React.FC<CellProps> = ({size, color}) => {
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
}




const COLS = 10
const ROWS = 20

interface BoardProps {
    cellSize: number,
    board: CellState[][],
}

export const Board: React.FC<BoardProps> = ({cellSize, board}) => {

    const size = cellSize
    const width = size * COLS
    const height = size * ROWS

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
			gridTemplateColumns: `repeat(${COLS}, ${size}px)`,
            height: height,
            width: width,
		}} >
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
