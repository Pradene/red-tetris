import { TetrominoType } from '@shared/define'
import { Piece } from './piece'

describe('Piece class', () => {
	it('should rotate correctly', () => {
		const piece = new Piece(TetrominoType.T, {x: 0, y: 0})

		piece.rotate()
		expect(piece.shape).toEqual([
			['T', '0'],
			['T', 'T'],
			['T', '0'],
		])

		piece.rotate()
		expect(piece.shape).toEqual([
				['T','T','T'],
				['0','T','0'],
		])

		piece.rotate()
		expect(piece.shape).toEqual([
			['0', 'T'],
			['T', 'T'],
			['0', 'T'],
		])
	})
})