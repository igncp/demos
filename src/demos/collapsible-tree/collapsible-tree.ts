import { renderChart } from "./collapsible-tree-chart"
import { createChartConfig, fetchData } from "./collapsible-tree-chart-config"
import { CONTAINER_ID } from "./ui-constants"

const main = async () => {
  const rootData = await fetchData()

  const chartConfig = createChartConfig(rootData)

  renderChart(chartConfig)
}

export { CONTAINER_ID }

export default main
