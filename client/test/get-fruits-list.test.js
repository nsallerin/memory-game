import { getRandomFruitsList } from "../src/utils/get-fruits-list.js"

describe("getRandomFruitsList", () => {
  it("Should create a random fruits list which is different each time", () => {
    const fruitsList1 = getRandomFruitsList()
    const fruitsList2 = getRandomFruitsList()
    
    expect(fruitsList1.length).toBe(28);
    expect(fruitsList2.length).toBe(28);

    expect(fruitsList1).not.toEqual(fruitsList2)
  })
})
