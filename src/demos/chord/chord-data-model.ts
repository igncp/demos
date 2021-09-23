import { csv } from "d3"

type CSVDataItem = {
  amount: string
  creditor: string
  debtor: string
  risk: string
}

type Country = {
  id: number
  name: string
}

type Creditor = Country
type Debtor = Country & { risk: string }

type CSVParsedItem = {
  amount: string
  creditor: Creditor
  debtor: Debtor
  risk: string
}

type FinancialMatrix = Array<Array<CSVParsedItem | null>>

class FinancialData {
  private readonly credits: FinancialMatrix
  private readonly debits: FinancialMatrix
  private readonly countriesList: Country[]

  private constructor({
    countriesList,
    credits,
    debits,
  }: {
    countriesList: Country[]
    credits: FinancialMatrix
    debits: FinancialMatrix
  }) {
    this.credits = credits
    this.debits = debits
    this.countriesList = countriesList
  }

  public static async fetchAndCreate(): Promise<FinancialData> {
    const originalCSVItems = (await csv(
      `${ROOT_PATH}data/d3js/chord/data.csv`
    )) as CSVDataItem[]

    const countriesList: Country[] = []
    const countries: Record<string, Country> = {}
    const debits: FinancialMatrix = []
    const credits: FinancialMatrix = []

    let id = 0

    const country = (countryName: string): Country => {
      if (!(countryName in countries)) {
        countries[countryName] = {
          id,
          name: countryName,
        }

        id += 1
      }

      return countries[countryName]
    }

    const parsedList: CSVParsedItem[] = originalCSVItems.map(
      (originalCSVItem) => ({
        ...originalCSVItem,
        creditor: country(originalCSVItem.creditor),
        debtor: {
          ...country(originalCSVItem.debtor),
          risk: originalCSVItem.risk,
        },
      })
    )

    Array.from({ length: id }).forEach((...[, sourceIndex]) => {
      debits[sourceIndex] = []
      credits[sourceIndex] = []

      Array.from({ length: id }).forEach((...[, targetIndex]) => {
        debits[sourceIndex][targetIndex] = null
        credits[sourceIndex][targetIndex] = null
      })
    })

    parsedList.forEach((financialItem) => {
      debits[financialItem.creditor.id][financialItem.debtor.id] = financialItem
      credits[financialItem.debtor.id][financialItem.creditor.id] =
        financialItem

      countriesList[financialItem.creditor.id] = financialItem.creditor
      countriesList[financialItem.debtor.id] = financialItem.debtor
    })

    return new FinancialData({
      countriesList,
      credits,
      debits,
    })
  }

  public getCredits() {
    return this.credits
  }

  public getDebits() {
    return this.debits
  }

  public getCountriesList() {
    return this.countriesList
  }
}

export { FinancialData, FinancialMatrix }
