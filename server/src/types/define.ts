export enum TetrominoType {
    T = "T",
    I = "I",
    O = "O",
    L = "L",
    J = "J",
    S = "S",
    Z = "Z"
};

export enum CellType {
    Empty = "0",
    Blocked = "X"
};

export type CellState = CellType | TetrominoType;
export const CellState = {
    ...CellType,
    ...TetrominoType
};

export const TetrominoShapes: Record<TetrominoType, string[][]> = {
	[TetrominoType.I]: [
		["I", "I", "I", "I"],
		["0", "0", "0", "0"],
	],
	[TetrominoType.J]: [
		["J", "0", "0"],
		["J", "J", "J"]
	],
	[TetrominoType.L]: [
		["0", "0", "L"],
		["L", "L", "L"]
	],
	[TetrominoType.O]: [
		["O", "O"],
		["O", "O"]
	],
	[TetrominoType.S]: [
		["0", "S", "S"],
		["S", "S", "0"]
	],
	[TetrominoType.T]: [
		["0", "T", "0"],
		["T", "T", "T"]
	],
	[TetrominoType.Z]: [
		["Z", "Z", "0"],
		["0", "Z", "Z"]
	]
};
