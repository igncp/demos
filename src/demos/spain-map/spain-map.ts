import { renderChart } from "./spain-map-chart"
import {
  Properties,
  createChartConfig,
  fetchData,
} from "./spain-map-chart-data"

const main = async () => {
  const data = await fetchData()
  const chartConfig = createChartConfig(data)

  renderChart<Properties>(chartConfig)
}

export default main
