import { json } from "d3"

type DataItem = {
  value: number | null // eslint-disable-line id-denylist
  year: number
}

/**
 * The data types are encapsulated and not shared
 */
type ExpensesData = {
  [country: string]: {
    [region: string]: DataItem[]
  }
}

class Expenses {
  public static ALL_ID = "All"

  private readonly countries: string[]
  private readonly expensesData: ExpensesData
  private readonly names: string[]
  private readonly regions: string[]

  private constructor(expensesData: ExpensesData) {
    const countries = Object.keys(expensesData).sort()

    this.countries = countries
    this.regions = Object.keys(expensesData[countries[0]]).sort()
    this.expensesData = expensesData
    this.names = countries.concat(this.regions)
  }

  public static async fetchAndCreate(): Promise<Expenses> {
    const expensesData = (await (json(
      `${ROOT_PATH}data/d3js/expenses-chord/data.json`
    ) as unknown)) as ExpensesData

    return new Expenses(expensesData)
  }

  public getRelationsMatrix({
    countryFilter,
    regionFilter,
    timeIndexFilter,
  }: {
    countryFilter: string
    regionFilter: string
    timeIndexFilter: number
  }): number[][] {
    const { expensesData, names } = this

    return names.map((maybeCountry) => {
      if (!expensesData[maybeCountry] as unknown) {
        return names.map(() => 0)
      }

      if (![Expenses.ALL_ID, maybeCountry].includes(countryFilter)) {
        return names.map(() => 0)
      }

      return names.map((maybeRegion) => {
        const {
          [maybeCountry]: { [maybeRegion]: dataItem },
        } = expensesData

        if (!dataItem as unknown) {
          return 0
        }

        if (![Expenses.ALL_ID, maybeRegion].includes(regionFilter)) {
          return 0
        }

        return dataItem[timeIndexFilter].value
      })
    }) as number[][]
  }

  public getTimeFramesNumber(): number {
    const { countries, expensesData, regions } = this

    return expensesData[countries[0]][regions[0]].length - 1
  }

  public getCountriesList(): Expenses["countries"] {
    return this.countries.slice()
  }

  public getRegionsList(): Expenses["regions"] {
    return this.regions.slice()
  }

  public getAllNames(): Expenses["names"] {
    return this.names.slice()
  }
}

export { Expenses }
