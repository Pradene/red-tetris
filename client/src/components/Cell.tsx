import React from "react"

import styles from "./Cell.module.css"

export type CellState = "J" | "L" | "O" | "T" | "I" | "Z" | "S" | "0"
interface CellProps {
	color: string
}

export const Cell: React.FC<CellProps> = ({ color}) => {
	return (
		<div style={{ backgroundColor: color }} className={styles.cell} >
			<div className={`${styles.circle} ${styles.topLeft}`} />
			<div className={`${styles.circle} ${styles.topRight}`} />
			<div className={`${styles.circle} ${styles.bottomLeft}`} />
			<div className={`${styles.circle} ${styles.bottomRight}`} />
		</div>
	)
}