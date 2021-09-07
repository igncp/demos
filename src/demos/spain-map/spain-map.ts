import { renderChart } from "./spain-map-chart"
import {
  CONTAINER_ID,
  Properties,
  createChartConfig,
  fetchAreasData,
} from "./spain-map-chart-data"

const main = async () => {
  const areasData = await fetchAreasData()
  const chartConfig = createChartConfig(areasData)

  renderChart<Properties>(chartConfig)
}

export { CONTAINER_ID }

export default main
