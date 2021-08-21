import { renderChart } from "./spain-map-chart"
import {
  Properties,
  createChartConfig,
  fetchAreasData,
} from "./spain-map-chart-data"

const main = async () => {
  const areasData = await fetchAreasData()
  const chartConfig = createChartConfig(areasData)

  renderChart<Properties>(chartConfig)
}

export default main
