import { renderChart } from "./area-chart"
import { CONTAINER_ID, createChartConfig } from "./income-chart-config"
import { setupChartControls } from "./income-chart-controls"
import { IncomeItem } from "./income-item-model"

const main = async () => {
  const dataPoints = await IncomeItem.fetchAndCreateCollection()
  const chartConfig = createChartConfig(dataPoints)

  const { toggleVoronoi } = renderChart<IncomeItem>(chartConfig)

  setupChartControls(toggleVoronoi)
}

export { CONTAINER_ID }

export default main
