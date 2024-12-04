export class Piece {
	shape: number[][]
	position: {x: number, y: number}
	
	constructor(shape: number[][]) {
		this.shape = shape
		this.position = {x: 5, y: 0}
	}

	rotate() {
		this.shape = this.shape.map(([x, y]) => [-y, x])
	}

	getBlocks() {
		return this.shape.map(([dx, dy]) => ({
			x: this.position.x,
			y: this.position.y
		}))
	}
}