import { FishEyeChart } from "./fish-eye-chart"
import { CONTAINER_ID, fetchData, getChartConfig } from "./fish-eye-config"

const main = async () => {
  const incomeMetrics = await fetchData()
  const chartConfig = getChartConfig(incomeMetrics)

  const chart = new FishEyeChart(chartConfig)

  chart.render()
}

export { CONTAINER_ID }

export default main
