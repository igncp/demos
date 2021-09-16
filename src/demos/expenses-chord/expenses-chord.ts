import { renderChart } from "./expenses-chord-chart"
import {
  CONTAINER_ID,
  COUNTRIES_SELECT_ID,
  REGIONS_SELECT_ID,
  SLIDER_TIME_ID,
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

export { CONTAINER_ID, SLIDER_TIME_ID, COUNTRIES_SELECT_ID, REGIONS_SELECT_ID }

export default main
