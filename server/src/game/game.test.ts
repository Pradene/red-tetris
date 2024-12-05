import { Game } from "./game"

describe('Game class', () => {
    it('should create a piece', () => {
        const game = new Game(0)

        expect(game.pile.length).toEqual(10)
        
        game.createPiece()
        expect(game.pile.length).toEqual(11)
    })

    it('should create a game and initialize piece pile', () => {
        const game = new Game(0)

        const piece = game.getPieceByIndex(0)
        expect(piece).toBeDefined()
    })
})