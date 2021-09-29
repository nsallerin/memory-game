import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DOCKER_PORT,
})

export default db
