import { CONTAINER_ID, getChartConfig } from "./chart-config"
import { LinesChart } from "./lines-chart"

const main = async () => {
  const chartConfig = await getChartConfig()

  new LinesChart(chartConfig)
}

export { CONTAINER_ID }

export default main
