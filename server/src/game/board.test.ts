import { Game } from "./game"
import { Board } from "./board"
import { Piece } from "./piece"

describe('Board class', () => {
    it('should move a piece', () => {
        const game = new Game()
        const board = new Board(game)

        const piece: Piece | undefined = board.getNextPieceOfGame()
        
        const direction = {x: 0, y: 1}
        const moved = board.movePiece(piece, direction)

        expect(moved).toBeTruthy()
    })

    it('should move piece to bottom', () => {
        const board = new Board()

        const piece1 = board.getNextPieceOfType('I')
        board.currentPiece = piece1
        board.movePieceToBottom()

        // Move current piece to bottom so currentPiece is not the same as before, pick another
        expect(piece1?.position).toEqual({x: 5, y: 19})


        const piece2 = board.getNextPieceOfType('I')
        board.currentPiece = piece2
        board.movePieceToBottom()

        // Move current piece to bottom so currentPiece is not the same as before, pick another
        expect(piece2?.position).toEqual({x: 5, y: 18})

    })
})