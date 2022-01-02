import { getChartConfig } from "./chart-config"
import { LinesChart } from "./lines-chart"
import { CONTAINER_ID } from "./ui-constants"

const main = async () => {
  const chartConfig = await getChartConfig()

  new LinesChart(chartConfig)
}

export { CONTAINER_ID }

export default main
