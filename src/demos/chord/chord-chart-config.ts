import { format } from "d3"

import { FinancialData, FinancialMatrix } from "./chord-data-model"
import { ChartConfig } from "./double-chord-chart"

export const CONTAINER_ID = "chart"

export const getChartConfig = (financialData: FinancialData): ChartConfig => {
  const debits = financialData.getDebits()
  const credits = financialData.getCredits()
  const countriesList = financialData.getCountriesList()

  const formatCurrencyNum = format(",.3r")

  const formatCurrency = (currencyValue: number) =>
    `$${formatCurrencyNum(currencyValue)}B.`

  const getRibbonTitle: ChartConfig["getRibbonTitle"] = ({
    chartIndex,
    sourceIndex,
    sourceValue,
    targetIndex,
  }) => {
    const { [sourceIndex]: sourceData, [targetIndex]: targetData } =
      countriesList

    const names = [targetData.name, sourceData.name]

    if (chartIndex) {
      names.reverse()
    }

    return `${names[0]} owes ${names[1]} ${formatCurrency(sourceValue)}`
  }

  const getGroupTitle: ChartConfig["getGroupTitle"] = ({
    chartIndex,
    chordGroup,
  }) =>
    `${countriesList[chordGroup.index].name} ${
      chartIndex ? "owes" : "is owed"
    } ${formatCurrency(chordGroup.value)}`

  const groupItems = countriesList.map((country) => ({
    id: country.id,
    label: country.name,
  }))

  const extractChordMatrix = (row: FinancialMatrix[0]) =>
    row.map((cell) => (cell ? +cell.amount : 0))

  const chordLeft = debits.map(extractChordMatrix)
  const chordRight = credits.map(extractChordMatrix)

  return {
    chords: [chordLeft, chordRight],
    chordsTitles: ["Debits", "Credits"],
    getGroupTitle,
    getRibbonTitle,
    groupItems,
    rootElId: CONTAINER_ID,
  }
}
