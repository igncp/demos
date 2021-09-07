import { CONTAINER_ID, getChartConfig } from "./chord-chart-config"
import { FinancialData } from "./chord-data-model"
import { renderChart } from "./double-chord-chart"

const main = async () => {
  const financialData = await FinancialData.fetchAndCreate()
  const chartConfig = getChartConfig(financialData)

  renderChart(chartConfig)
}

export { CONTAINER_ID }

export default main
