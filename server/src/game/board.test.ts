import { Game } from "./game"
import { Board } from "./board"
import { Piece } from "./piece"

describe('Board class', () => {
    it('should move a piece', () => {
        const game = new Game()
        const board = new Board(game)

        board.getNextPieceOfGame()
        
        const direction = {x: 0, y: 1}
        const moved = board.movePiece(direction)

        expect(moved).toBeTruthy()
    })

    it('should move piece to bottom', () => {
        const board = new Board()

        const piece = board.getNextPieceOfType('I')
        board.currentPiece = piece
        board.movePieceToBottom()

        // Move current piece to bottom so currentPiece is not the same as before, pick another

        expect(board.currentPiece).toBeDefined()

    })
})