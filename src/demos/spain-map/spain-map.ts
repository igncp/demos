import { NMapChart } from "./n-map-chart"
import {
  CONTAINER_ID,
  Properties,
  UPDATE_BUTTON_ID,
  createChartConfig,
  fetchAreasData,
} from "./spain-map-chart-data"

const main = async () => {
  const areasData = await fetchAreasData()
  const chartConfig = createChartConfig(areasData)

  const mapChart = NMapChart.renderChart<Properties>(chartConfig)

  document.getElementById(UPDATE_BUTTON_ID)?.addEventListener("click", () => {
    mapChart.clearMarked()
  })
}

export { CONTAINER_ID, UPDATE_BUTTON_ID }

export default main
