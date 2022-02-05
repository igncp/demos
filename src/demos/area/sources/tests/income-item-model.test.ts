import { csv } from "d3"

import { IncomeItem } from "../income-item-model"

jest.mock("d3", () => ({ csv: jest.fn() }))

const mockCsv = csv as unknown as jest.Mock

const testData = [
  {
    percent: "15",
    year: "2000",
  },
  {
    percent: 20.123456,
    year: 2001,
  },
]

beforeEach(() => {
  mockCsv.mockClear()
  mockCsv.mockReturnValue(Promise.resolve(testData))
})

describe("changePercentage", () => {
  it("limits the percentage", async () => {
    const incomeItems = await IncomeItem.fetchAndCreateCollection()

    expect(incomeItems[0].getSummary()).not.toContain("Percentage: 100.00%")

    incomeItems[0].changePercentage(1000)
    expect(incomeItems[0].getSummary()).toContain("Percentage: 100.00%")

    incomeItems[0].changePercentage(-110)
    expect(incomeItems[0].getSummary()).toContain("Percentage: 0.00%")

    incomeItems[0].changePercentage(25.678)
    expect(incomeItems[0].getSummary()).toContain("Percentage: 25.68%")
  })
})

describe("getId", () => {
  it("generates different ids", async () => {
    const incomeItems = await IncomeItem.fetchAndCreateCollection()

    expect(incomeItems[0].getId()).not.toEqual(incomeItems[1].getId())
  })
})

describe("getSummary", () => {
  it("generates the expected summaries", async () => {
    const incomeItems = await IncomeItem.fetchAndCreateCollection()

    expect(incomeItems.map((incomeItem) => incomeItem.getSummary())).toEqual([
      "Year: 2000, Percentage: 15.00%",
      "Year: 2001, Percentage: 20.12%",
    ])
  })
})
