import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"

import * as gameController from "./game-controller.js"

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors())

app.get('/', (_request, response) => {
  response.json({ info: "Memory-game server" })
})

app.get('/games', (request, response) => {
  gameController.getAllGames(request, response)
})

app.post('/games', (request, response) => {
  gameController.createGame(request, response)
})

app.listen(port, () => {
  console.log(`Memory-game server running on port ${port}.`)
})
