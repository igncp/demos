import { renderChart } from "./expenses-chord-chart"
import {
  createChartConfig,
  createInitialState,
  setupChartForm,
} from "./expenses-chord-chart-data"
import { Expenses } from "./expenses-chord-data-model"

const main = async () => {
  const expenses = await Expenses.fetchAndCreate()

  const state = createInitialState()
  const chartConfig = createChartConfig({
    expenses,
    state,
  })

  const { renderItems } = renderChart(chartConfig)

  setupChartForm({
    expenses,
    renderItems,
    state,
  })
}

export default main
