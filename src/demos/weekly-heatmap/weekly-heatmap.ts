import { CONTAINER_ID } from "./ui-constants"
import { HeatmapChart } from "./weekly-heatmap-chart"
import {
  TimeItem,
  UPDATE_BUTTON_ID,
  createChartConfig,
  fetchData,
} from "./weekly-heatmap-data"

const main = async () => {
  const weeklyData = await fetchData()
  const chartConfig = createChartConfig(weeklyData)

  const heatmap = HeatmapChart.renderChart<TimeItem>(chartConfig)

  document.getElementById(UPDATE_BUTTON_ID)?.addEventListener("click", () => {
    weeklyData.forEach((weeklyDataItem) => {
      const shouldUpdate = Math.random() > 0.85

      if (shouldUpdate) {
        weeklyDataItem.arbitraryMetric += Math.random() * 100 + 30
      }
    })
    heatmap.refresh()
  })
}

export { CONTAINER_ID, UPDATE_BUTTON_ID }

export default main
