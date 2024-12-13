export const PieceTypes: string[] = ["I", "J", "L", "O", "S", "T", "Z",]

export const PieceShapes: { [key: string]: string[][] } = {
	"I": [
		["I", "I", "I", "I"],
		["0", "0", "0", "0"],
	],
	"J": [
		["J", "0", "0"],
		["J", "J", "J"]
	],
	"L": [
		["0", "0", "L"],
		["L", "L", "L"]
	],
	"O": [
		["O", "O"],
		["O", "O"]
	],
	"S": [
		["0", "S", "S"],
		["S", "S", "0"]
	],
	"T": [
		["0", "T", "0"],
		["T", "T", "T"]
	],
	"Z": [
		["Z", "Z", "0"],
		["0", "Z", "Z"]
	]
}

export class Piece {
	type: string
	shape: string[][]
	position: {x: number, y: number} | undefined

	constructor(type: string)
	constructor(type: string, position: {x: number, y: number} | undefined)
	constructor(type: string, position: {x: number, y: number} | undefined, shape: string[][] | undefined)

	constructor (type: string, position?: {x: number, y: number}, shape?: string[][]) {
		this.type = type
		this.position = position
		// Copy the shape is provided for rotation saving
		this.shape = (shape !== undefined) ? shape : PieceShapes[type] || []
	}

	static random(): Piece {
		const randomType = PieceTypes[Math.floor(Math.random() * PieceTypes.length)]
		return new Piece(randomType)
	}

	clone(): Piece {
		return new Piece(this.type, this.position, this.shape)
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