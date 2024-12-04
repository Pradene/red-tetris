import { Piece } from "./piece"

export class Game {
    pile: Piece[]

    constructor() {
        this.pile = []

        this.initializePile()
    }

    initializePile(): void {
        this.createPiece(10)
    }

    addPlayer(userId: number): void {

    }

    createPiece(count: number = 1): void {
        for (let index = 0; index < count; index++) {
            this.pile.push(Piece.random())
        }
    }

    getPieceByIndex(index: number): Piece | undefined {
        if (index < 0) {
            return undefined
        }

        while (index >= this.pile.length) {
            this.createPiece()
        }

        return this.pile[index]
    }
}