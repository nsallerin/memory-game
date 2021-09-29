import { getRandomFruitsList } from "./utils/get-fruits-list.js"
import * as gameAPI from "./api/game-api.js"

class Game {
  /**
   * The Game constructor, whose parameters has to be passed when a new instance is created.
   * @constructor
   * @param {HTMLElement} gameContainer The html element the game will be inserted in
   * @param {number} gameConfig.duration The duration (in seconds) the player has to complete the game, which is displayed by the progress bar
   */
  constructor(gameContainer, gameDuration) {
    this.fruitsList = getRandomFruitsList()
    this.gameContainer = gameContainer
    this.gameDuration = gameDuration
    this.displayMenu()
  }

  /**
   * @returns {Boolean} Returns a boolean 'true' when the player successfully matches all the fruits pairs
   */
  isGameWon() {
    return this.successfulAttempts == this.fruitsList.length / 2
  }

  /**
   * Handles the display of the card when the player clicks on it
   * @param {HTMLElement} card The card html element which has to be revealed
   * @param {string} fruitName The fruit name is added to its card class list only when it is revealed,
   * so to not leak the solution within the source code of the page
   */
  flipCard(card, fruitName) {
    card.classList.remove("unrevealed")
    card.classList.add("revealed")
    card.classList.add(`${fruitName}`)
  }

  /**
   * Handles for match when the player has revealed two cards
   */
  checkSelectionMatch() {
    // Freezes the grid, so to prevent the player to click another card until the verfication is done
    this.grid.classList.add("no-click")
        
    const indexes = this.currentSelection.map(card => card.fruitIndex)

    const match = this.fruitsList[indexes[0]] == this.fruitsList[indexes[1]]
    
    if(match) {
      // If the two cards match, clears the currentSelection state and increases the successfulAttempts count by 1
      this.currentSelection = []
      this.grid.classList.remove("no-click")
      this.successfulAttempts += 1
      // On each attempt, check if the game is won and ends the game if needed
      if (this.isGameWon()) {
        this.finishGame(true)
      }

    } else {
      setTimeout(() => {
        // If the match fails, keeps the grid frezzed for 1 second and turns over the two cards
        this.resetAttempt()
      }, 1000)
    }
    // Wether the match is successful or not, increases the totalAttempts count by 1 on each attempt
    this.totalAttempts += 1
  }

  /**
   * Handles the action when the player clicks on a card
   * @param {string} fruitName The fruit name related to the card the player reveals
   * @param {number} fruitIndex The fruit index related to its position in the initial fruit list, generated when the game instance is created
   */
  checkCard(fruitName, fruitIndex) {
      // If it is the first card revealed for the current attempt, pushes the related fruit name and index in the currentSelection state 
      if (this.currentSelection.length < 2) {
        this.currentSelection.push({fruitName, fruitIndex})
      }

      // If it is the second card revealed for the current attempt, checks if the two cards match
      if (this.currentSelection.length == 2) {
        this.checkSelectionMatch()
      }
  }
  
  /**
   * Turns over the two revealed cards of the current attempt, clears the currentSelection state and unfreezes the grid
   * so the player can choose two other cards
   */
  resetAttempt() {
    this.currentSelection.forEach(({fruitName}) => {
      const card = this.grid.getElementsByClassName(fruitName)[0]
      card.classList.remove("revealed", fruitName)
      card.classList.add("unrevealed")
    })
    this.currentSelection = []
    this.grid.classList.remove("no-click")
  }

  /**
   * Handles the scores table creation which is displayed on the landing page
   * @param {Array} scores The scores array which is created from the data retrieved from the server API
   * @returns {HTMLElement} Returns the html element containing a table with the scores formatted for display
   */
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

  /**
   * Displays the menu to the player on the landing page containing:
   * - the form which allows the player to start the game 
   * and sends the player's name to the game instance
   * - the scores table displaying the details of all the previous games
   */
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

    // Cleans the HTML from the previous game to let the place for a new menu page
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

  /**
   * Creates a flex-box grid which will wrap the cards
   * @returns {HTMLElement} Returns the grid html element used for displaying the cards
   */
  createGrid() {
    const grid = document.createElement("ul")
    grid.classList.add("fruits-flexbox")
  
    this.gameContainer.appendChild(grid)

    return grid
  }

  /**
   * Creates all the fruits cards which will be displayed
   * @returns {Array} Returns an array of fruits cards html elements
   */
  createFruitCards() {
    const fruitCards = this.fruitsList.map((fruitName, index) => {
      const card = document.createElement("li")
        card.classList.add("fruit-card")
        card.classList.add("unrevealed")
        card.addEventListener("click", () => {
          // Keeps the link between each card and its related fruit
          this.flipCard(card, fruitName)
          this.checkCard(fruitName, index)
        })

        return card
    })

    return fruitCards
  }

  /**
   * Creates the progress time bar which is displayed to the player during the game
   * @param {integer} duration The duration the player has to complete the game
   * @returns {HTMLElement} Returns the progress time bar html element which is displayed above the cards grid
   */
  createProgressBar(duration = 180) {
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

  /**
   * Creates the message and the button which are displayed to the player after the game has ended
   * @returns {HTMLElement} Returns an html element which wraps the end game message
   * depending on the game is won or lost and the button which allows the player to start another game
   */
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

  /**
   * Handles the game start when the player click on the 'Start Game' button
   * @param {string} playerName The player name retrieved from the landing page form input
   * (by default 'John Doeuf' if no parameter is passed)
   */
  startGame(playerName = "John Doeuf"){
    // Cleans the HTML to let the place for the game grid and the progress bar
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

  /**
   * Handles to end the game and display the result page when the player has successful matched all the pairs 
   * or when the time is out
   * @param {gameWon} gameWon The boolean which will be saved in the DB to keep track of wether the game was won or lost
   */
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

    // Sends the current game score to the server API
    await gameAPI.postGameScore(gameScore).catch(console.error)

    // Cleans the HTML to let the place for the result page
    this.gameContainer.innerHTML = ""
    const endGameMessage = this.createEndGameMessage()
    this.gameContainer.appendChild(endGameMessage)

    // Update the scores table before displaying it 
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
