import { renderChart } from "./weekly-heatmap-chart"
import { TimeItem, createChartConfig, fetchData } from "./weekly-heatmap-data"

const main = async () => {
  const data = await fetchData()
  const chartConfig = createChartConfig(data)

  renderChart<TimeItem>(chartConfig)
}

export default main
