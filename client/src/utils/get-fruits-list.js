const fruitsList = [
  "red-apple",
  "banana",
  "orange",
  "lime",
  "pomegranate",
  "apricot",
  "lemon",
  "strawberry",
  "green-apple",
  "peach",
  "grape",
  "watermelon",
  "plum",
  "pear",
  "cherry",
  "raspberry",
  "mango",
  "yellow-cherry"
]

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

function getRandomFruitsList() {
  const shuffledList = shuffle(fruitsList).slice(4)

  return shuffle([...shuffledList, ...shuffledList])
}

export { getRandomFruitsList }
