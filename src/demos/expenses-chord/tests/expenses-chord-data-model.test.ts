import { json } from "d3"

import { Expenses } from "../expenses-chord-data-model"

jest.mock("d3", () => ({ json: jest.fn() }))

const mockJson = json as unknown as jest.Mock

const testData = {
  barCountry: {
    barRegion: [
      {
        value: 2, // eslint-disable-line id-denylist
        year: 2002,
      },
    ],
    fooRegion: [
      {
        value: null, // eslint-disable-line id-denylist
        year: 2001,
      },
    ],
  },
  fooCountry: {
    fooRegion: [
      {
        value: 1, // eslint-disable-line id-denylist
        year: 2001,
      },
    ],
  },
}

beforeEach(() => {
  mockJson.mockClear()
  mockJson.mockReturnValue(Promise.resolve(testData))
})

describe("getCountriesList", () => {
  it("returns the expected countries", async () => {
    const expenses = await Expenses.fetchAndCreate()
    const countries = expenses.getCountriesList()

    expect(countries).toEqual(["barCountry", "fooCountry"])
  })
})

describe("getRegionsList", () => {
  it("returns the expected regions", async () => {
    const expenses = await Expenses.fetchAndCreate()
    const regions = expenses.getRegionsList()

    // it collects all regions, some of them are not present in all countries
    expect(regions).toEqual(["barRegion", "fooRegion"])
  })
})

describe("getRelationsMatrix", () => {
  it("converts null values to 0", async () => {
    const expenses = await Expenses.fetchAndCreate()
    const matrix = expenses.getRelationsMatrix({
      countryFilter: Expenses.ALL_ID,
      regionFilter: Expenses.ALL_ID,
      timeIndexFilter: 0,
    })

    // in the test data, some of the items at index 0 have null value, which should not appear in the matrix
    const hasNull = matrix.some((row) =>
      row.some((cell) => (cell as unknown) === null)
    )

    expect(hasNull).toEqual(false)
  })
})
