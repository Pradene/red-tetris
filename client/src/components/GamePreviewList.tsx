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
						<h3 style={{margin: "0"}}>{username}:</h3>
						<p style={{margin: "0"}}>0 points</p>
					</div>
					<div style={{width: "40px", marginLeft: "auto"}}>
						<Board cols={10} rows={20} board={board} />
					</div>
		  		</div>
			))}
	  	</div>
	)
}

export default GamePreviewList