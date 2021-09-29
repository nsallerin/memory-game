/**
 * @jest-environment jsdom
 */

import { Game } from "../src/game"

describe("Game", () => {
  let gameContainer

  beforeEach(() => {
    gameContainer = document.createElement("div")
    gameContainer.setAttribute("id", "game")
  })

  it("Should create a grid with class name 'fruits-flexbox'", () => {
    const game = new Game(gameContainer)
    expect(game.gameContainer.querySelector(".fruits-flexbox")).toBeDefined()
  })
})
