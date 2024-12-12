import React from 'react'
import { Board, CellState } from './Board'

import styles from "./GamePreviewList.module.css"

interface GamePreviewProps {
	gamePreviews: Map < string, CellState[][]>
}

const GamePreviewList: React.FC<GamePreviewProps> = ({ gamePreviews }) => {	
	return (
	  	<div className={styles.gamePreviewList}>
			{Array.from(gamePreviews.entries()).map(([username, board], index) => (
		  		<div key={index} className={styles.gamePreview}>
					<h3 style={{margin: "0"}}>{username}:</h3>
					<div style={{width: "40px", marginLeft: "auto"}}>
						<Board cols={10} rows={20} board={board} />
					</div>
		  		</div>
			))}
	  	</div>
	)
}

export default GamePreviewList