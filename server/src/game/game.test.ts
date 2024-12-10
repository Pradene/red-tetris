import { Game } from "./game"

describe('Game class', () => {
    it('should create a pile piece', () => {
        const id = "hello"
        const game = new Game(id)
        game.start()

        expect(game.pile.length).toEqual(10)
    })

    it('should create a game and initialize piece pile', () => {
        const id = "hello"
        const game = new Game(id)

        const piece = game.getPieceByIndex(0)
        expect(piece).toBeDefined()
    })
})