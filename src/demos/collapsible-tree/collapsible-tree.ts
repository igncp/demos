import { renderChart } from "./collapsible-tree-chart"
import {
  CONTAINER_ID,
  createChartConfig,
  fetchData,
} from "./collapsible-tree-chart-config"

const main = async () => {
  const rootData = await fetchData()

  const chartConfig = createChartConfig(rootData)

  renderChart(chartConfig)
}

export { CONTAINER_ID }

export default main
