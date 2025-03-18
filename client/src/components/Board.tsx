import React from "react";

import { CellState, Cell } from "./Cell";

import styles from "./Board.module.css";

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
		return `var(--color-${type.toUpperCase()})`;
	}

	return (
		<div
			className={styles.board}
			style={{
				"--cols": cols,
				"--rows": rows,
			} as React.CSSProperties}
		>
		{standardizedBoard.map((row, rowIndex) =>
			row.map((cell, colIndex) => (
				<Cell
					key={`${rowIndex * cols + colIndex}`}
					color={getColorForCell(cell)} // Pass the color dynamically based on the cell state
				/>
			))
		)}
		</div>
	)
}
