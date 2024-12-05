import { Game } from "./game"

describe('Game class', () => {
    it('should create a pile piece', () => {
        const game = new Game(0)
        game.start()

        expect(game.pile.length).toEqual(10)
    })

    it('should create a game and initialize piece pile', () => {
        const game = new Game(0)

        const piece = game.getPieceByIndex(0)
        expect(piece).toBeDefined()
    })
})