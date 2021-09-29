import { getRandomFruitsList } from "./utils/get-fruits-list.js"
import * as gameAPI from "./api/game-api.js"

class Game {
  constructor(gameContainer, gameDuration) {
    this.fruitsList = getRandomFruitsList()
    this.gameContainer = gameContainer
    this.gameDuration = gameDuration
    this.displayMenu()
  }

  isGameWon() {
    return this.successfulAttempts == this.fruitsList.length / 2
  }

  flipCard(card, fruitName) {
    card.classList.remove("unrevealed")
    card.classList.add("revealed")
    card.classList.add(`${fruitName}`)
  }

  checkSelectionMatch() {
    this.grid.classList.add("no-click")
        
    const indexes = this.currentSelection.map(card => card.fruitIndex)

    const match = this.fruitsList[indexes[0]] == this.fruitsList[indexes[1]]
    
    if(match) {
      this.currentSelection = []
      this.grid.classList.remove("no-click")
      this.successfulAttempts += 1
      if (this.isGameWon()) {
        this.finishGame(true)
      }

    } else {
      setTimeout(() => {
        this.resetAttempt()
      }, 1000)
    }
    this.totalAttempts += 1
  }

  checkCard(fruitName, fruitIndex) {
      if (this.currentSelection.length < 2) {
        this.currentSelection.push({fruitName, fruitIndex})
      }

      if (this.currentSelection.length == 2) {
        this.checkSelectionMatch()
      }
  }
  
  resetAttempt() {
    this.currentSelection.forEach(({fruitName}) => {
      const card = this.grid.getElementsByClassName(fruitName)[0]
      card.classList.remove("revealed", fruitName)
      card.classList.add("unrevealed")
    })
    this.currentSelection = []
    this.grid.classList.remove("no-click")
  }

  createScoresTable(scores) {
    const scoresTableContainer = document.createElement("div")
    scoresTableContainer.setAttribute("id", "scores-table")

    const scoresTable = document.createElement("table")

    const headersNames = ["Player", "Time", "Attempts", "Game Win"]

    const headersRow = document.createElement("tr") 

    headersNames.forEach((title) => {
      const th = document.createElement("th")
      th.innerText = title
      headersRow.appendChild(th)
    })

    const scoresTableHeader = document.createElement("thead")
    scoresTableHeader.appendChild(headersRow)

    scoresTable.appendChild(scoresTableHeader)

    const scoresTableBody = document.createElement("tbody")

    const formattedScores = scores.map(({player, time, attempts, is_won}) => {
      return {
        player,
        time: `${time}s`,
        attempts,
        is_won: is_won ? "✅" : "❌"
      }
    })

    formattedScores.forEach((score) => {
      const tr = document.createElement("tr")
      const values = Object.values(score)

      values.forEach((value) => {
        const td = document.createElement("td")
        td.innerText = value
        tr.appendChild(td)
      })

      scoresTableBody.appendChild(tr)
    })

    scoresTable.appendChild(scoresTableBody)

    scoresTableContainer.appendChild(scoresTable)

    return scoresTableContainer
  }

  async displayMenu() {
    const menu = document.createElement("div")
    menu.setAttribute("id", "menu")

    const input = document.createElement("input")
    input.placeholder = "ex: John Doeuf"
    input.setAttribute("id", "player-name")

    const label = document.createElement("label")
    label.htmlFor = "name"
    label.innerText = "What's your name?"

    const startButton = document.createElement("button")
    startButton.innerText = "Start game"
    startButton.classList.add("start-button")
    startButton.addEventListener("click", () => {
      this.startGame(input.value || undefined)
    })

    this.gameContainer.innerHTML = ""
    menu.appendChild(label)
    menu.appendChild(input)
    menu.appendChild(startButton)
    this.gameContainer.appendChild(menu)
    
    gameAPI.getAllGamesScores().then((scores) => {
      const scoresTable = this.createScoresTable(scores)
      this.gameContainer.appendChild(scoresTable)
    }).catch(() => {
      const emptyScoresTable = this.createScoresTable([])
      this.gameContainer.appendChild(emptyScoresTable)
    }).finally(() => {
      input.focus()
    })
  }

  createGrid() {
    const grid = document.createElement("ul")
    grid.classList.add("fruits-flexbox")
  
    this.gameContainer.appendChild(grid)

    return grid
  }

  createFruitCards() {
    const fruitCards = this.fruitsList.map((fruitName, index) => {
      const card = document.createElement("li")
        card.classList.add("fruit-card")
        card.classList.add("unrevealed")
        card.addEventListener("click", () => {
          this.flipCard(card, fruitName)
          this.checkCard(fruitName, index)
        })

        return card
    })

    return fruitCards
  }

  createProgressBar(duration = 300) {
    const progressBarContainer = document.createElement("div")
    progressBarContainer.setAttribute("id", "progress-bar-container")

    const progressBar = document.createElement("div")
    progressBar.setAttribute("id", "progress-bar")

    progressBar.style.animationDuration = `${duration}s`

    progressBar.addEventListener('animationend', () => {
      this.finishGame(this.isGameWon())
    });
    

    progressBarContainer.appendChild(progressBar)

    return progressBarContainer
  }

  createEndGameMessage() {
    const message = this.isGameWon() ? "You won 🤟, congratulation!" : "You lose 😿"

    const restartButton = document.createElement("button")
    restartButton.innerText = "Try again"
    restartButton.classList.add("restart-button")
    restartButton.addEventListener("click", () => {
      this.displayMenu()
    })

    const messageWrapper = document.createElement("div")
    messageWrapper.classList.add("message-wrapper")
    messageWrapper.innerHTML = message

    const endMessageContainer = document.createElement("div")
    endMessageContainer.classList.add("end-message-container")
    endMessageContainer.appendChild(messageWrapper)
    endMessageContainer.appendChild(restartButton)

    return endMessageContainer
  }

  startGame(playerName = "John Doeuf"){
    this.gameContainer.innerHTML = ""
    this.player = playerName
    this.currentSelection = []
    this.successfulAttempts = 0
    this.totalAttempts = 0
    this.grid = this.createGrid()
    this.cards = this.createFruitCards()
    this.cards.forEach((card) => {
      this.grid.appendChild(card)
    })
    this.progressBar = this.createProgressBar(this.gameDuration)
    this.grid.appendChild(this.progressBar)
    this.startTime = new Date()
  }

  async finishGame(gameWon) {
    this.endTime = new Date()
    this.totalTime = this.endTime - this.startTime
    const gameLength = Math.floor(this.totalTime / 1000)

    const gameScore = {
      player: this.player,
      time: gameLength,
      attempts: this.totalAttempts,
      is_won: gameWon
    }

    await gameAPI.postGameScore(gameScore).catch(console.error)

    this.gameContainer.innerHTML = ""
    const endGameMessage = this.createEndGameMessage()
    this.gameContainer.appendChild(endGameMessage)

    gameAPI.getAllGamesScores().then((updatedScores) => {
      const scoresTable = this.createScoresTable(updatedScores)
      this.gameContainer.appendChild(scoresTable)
    }).catch(() => {
      const emptyScoresTable = this.createScoresTable([])
      this.gameContainer.appendChild(emptyScoresTable)
    })
  }
}

export { Game }
