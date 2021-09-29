import fetch from "isomorphic-unfetch"

async function getAllGamesScores() {
  const response = await fetch(`${process.env.API_BASE_URL}/games`)
  return response.json()
}

async function postGameScore(data) {
  await fetch(`${process.env.API_BASE_URL}/games`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  })
}

export { getAllGamesScores, postGameScore }
