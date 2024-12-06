import React from 'react'
import { Board, CellState } from './Board'

interface GamePreviewProps {
	gamePreviews: CellState[][][]
}

const GamePreviewList: React.FC<GamePreviewProps> = ({ gamePreviews }) => {
	return (
	  	<div className='game-preview-list'>
			{gamePreviews.map((board: CellState[][], playerIndex: number) => (
		  		<div key={playerIndex} className='game-preview'>
					<div>
						<h3>Player {playerIndex + 1}</h3>
						<p>Score: </p>
					</div>
					<Board board={board} cellSize={4} />
		  		</div>
			))}
	  	</div>
	)
}

export default GamePreviewList