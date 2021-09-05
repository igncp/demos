import { renderChart } from "./area-chart"
import { createChartConfig } from "./income-chart-config"
import { setupChartControls } from "./income-chart-controls"
import { IncomeItem } from "./income-item-model"

const main = async () => {
  const dataPoints = await IncomeItem.fetchAndCreateCollection()
  const chartConfig = createChartConfig(dataPoints)

  const { toggleVoronoi } = renderChart<IncomeItem>(chartConfig)

  setupChartControls(toggleVoronoi)
}

export default main
