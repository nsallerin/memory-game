import "../style/index.sass"
import { Game } from "./game.js";

const gameContainer = document.getElementById("game-container")


try {
  new Game(gameContainer, 180)
} catch (error) {
  console.error(error)
}
