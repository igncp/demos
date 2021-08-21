import { renderChart } from "./weekly-heatmap-chart"
import { TimeItem, createChartConfig, fetchData } from "./weekly-heatmap-data"

const main = async () => {
  const weeklyData = await fetchData()
  const chartConfig = createChartConfig(weeklyData)

  renderChart<TimeItem>(chartConfig)
}

export default main
