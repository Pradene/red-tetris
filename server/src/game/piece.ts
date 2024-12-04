import { reverse } from "dns"

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
	position: {x: number, y: number}

	constructor(type: string) {
		this.type = type
		this.position = {x: 5, y: 0}
		this.shape = PieceShapes[type] || []
	}

	static random(): Piece {
		const randomType = PieceTypes[Math.floor(Math.random() * PieceTypes.length)]
		return new Piece(randomType)
	}

	print() {
		this.shape.forEach(row => {
			console.log(row.join(' '))
		})
	}

	rotate(): void {
        // The idea of rotating a 2D matrix is to transpose and then reverse each row
        this.shape = this.shape[0].map((_, index) => this.shape.map(row => row[index]).reverse())
    }

	getBlocks() {
		return this.shape.map(([dx, dy]) => ({
			x: this.position.x,
			y: this.position.y
		}))
	}
}