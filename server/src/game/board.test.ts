import { Game } from "./game"
import { Board } from "./board"

describe('Board class', () => {
    it('should move a piece', () => {
        const game = new Game()
        const board = new Board(game)

        board.getNextPiece()
        
        const direction = {x: 0, y: 1}
        const moved = board.movePiece(direction)

        expect(moved).toBeTruthy()
    })
})