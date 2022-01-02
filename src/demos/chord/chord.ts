import { UPDATE_BUTTON_ID, getChartConfig } from "./chord-chart-config"
import { FinancialData } from "./chord-data-model"
import { NChordChart } from "./n-chord-chart"
import { CONTAINER_ID } from "./ui-constants"

const main = async () => {
  const financialData = await FinancialData.fetchAndCreate()
  const chartConfig = getChartConfig(financialData)

  const chordChart = NChordChart.renderChart(chartConfig)
  const buttonEl = document.getElementById(UPDATE_BUTTON_ID)!

  buttonEl.addEventListener("click", () => {
    chartConfig.chords.forEach((chordMatrix) => {
      chordMatrix.forEach((...[chordRow, chordRowIndex]) => {
        chordRow.forEach((...[, chordCellIndex]) => {
          // Avoid creating a self-referencing ribbon
          if (chordRowIndex === chordCellIndex) {
            return
          }

          const shouldUpdate = Math.random() < 0.1

          if (shouldUpdate) {
            chordRow[chordCellIndex] = Math.max(
              0,
              Math.floor(Math.random() * 100) - 20
            )
          }
        })
      })
    })
    chordChart.refresh()
  })
}

export { CONTAINER_ID, UPDATE_BUTTON_ID }

export default main
