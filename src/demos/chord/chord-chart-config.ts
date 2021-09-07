import { format } from "d3"

import { FinancialData, FinancialMatrix } from "./chord-data-model"
import { ChartConfig } from "./double-chord-chart"

export const CONTAINER_ID = "chart"

export const getChartConfig = (financialData: FinancialData): ChartConfig => {
  const debits = financialData.getDebits()
  const credits = financialData.getCredits()
  const countriesList = financialData.getCountriesList()

  const formatCurrency = format(",.3r")

  const getRibbonTitle: ChartConfig["getRibbonTitle"] = ({
    sourceIndex,
    sourceValue,
    targetIndex,
  }) => {
    const {
      [sourceIndex]: sourceData,
      [targetIndex]: targetData,
    } = countriesList

    return `${sourceData.name} owes ${targetData.name} $${formatCurrency(
      sourceValue
    )}B.`
  }

  const getGroupTitle: ChartConfig["getGroupTitle"] = ({
    chartIndex,
    chordGroup,
  }) =>
    `${countriesList[chordGroup.index].name} ${
      chartIndex ? "owes" : "is owed"
    } $${formatCurrency(chordGroup.value)}B.`

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
