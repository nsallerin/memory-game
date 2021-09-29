import db from "./database.js"
import { v4 as uuid } from 'uuid';

const getAllGames = (_request, response) => {
  db.query(
    `SELECT * FROM game
      ORDER BY time ASC`, 
    (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createGame = (request, response) => {
  const { player, time, attempts, is_won } = request.body

  const id = uuid()

  db.query(
    `INSERT INTO game (id, player, time, attempts, is_won) 
      VALUES ($1, $2, $3, $4, $5)`,
    [id, player, time, attempts, is_won], 
    (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Game added with ID: ${id}`)
  })
}

export { getAllGames, createGame }
