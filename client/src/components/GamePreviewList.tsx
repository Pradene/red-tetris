import React from 'react'
import { Board, CellState } from './Board'

interface GamePreviewProps {
	gamePreviews: Map < string, CellState[][]>
}

const GamePreviewList: React.FC<GamePreviewProps> = ({ gamePreviews }) => {
	return (
	  	<div className='game-preview-list'>
			{Array.from(gamePreviews.entries()).map(([username, board], index) => (
		  		<div key={index} className='game-preview'>
					<div>
						<h3>{username}</h3>
						<p>Score: 0</p>
					</div>
					<div style={{height: "100%", width: "100%"}}>
						{/* <Board cols={10} rows={20} board={board} /> */}
					</div>
		  		</div>
			))}
	  	</div>
	)
}

export default GamePreviewList