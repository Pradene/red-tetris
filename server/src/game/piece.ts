import { TetrominoType, TetrominoShapes } from "../types/define"

export class Piece {
	type: TetrominoType
	shape: string[][]
	position: {x: number, y: number}

	constructor (type: TetrominoType, position: {x: number, y: number}) {
		this.type = type
		this.shape = this.cloneShape(TetrominoShapes[type])
		this.position = { ...position }
	}

	clone(): Piece {
		const position = { ...this.position }
		return new Piece(this.type, position)
	}

	cloneShape(shape: string[][]): string[][] {
		return shape.map(row => [...row])
	}

	print(): void {
		this.shape.forEach(row => {
			console.log(row.join(' '))
		})
	}

	getRotatedShape(): string[][] {
		return this.shape[0].map((_, index) => this.shape.map(row => row[index]).reverse())
	}

	rotate(): void {
		// The idea of rotating a 2D matrix is to transpose and then reverse each row
		this.shape = this.getRotatedShape()
	}
}