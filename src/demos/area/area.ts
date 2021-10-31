import { AreaChart } from "./chart/area-chart"
import { CONTAINER_ID, createChartConfig } from "./income-chart-config"
import { setupChartControls } from "./income-chart-controls"
import { IncomeItem } from "./income-item-model"

const main = async () => {
  const dataPoints = await IncomeItem.fetchAndCreateCollection()
  const chartConfig = createChartConfig(dataPoints)

  const areaChart = AreaChart.renderChart<IncomeItem>(chartConfig)

  setupChartControls({
    onToggleVoronoiClick: () => {
      areaChart.toggleVoronoi()
    },
    onUpdateRandomValue: () => {
      Array.from({ length: 50 }).forEach(() => {
        const randomIndex = Math.floor(Math.random() * dataPoints.length)
        const randomChange = Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)

        dataPoints[randomIndex].changePercentage(randomChange)
      })

      areaChart.refresh()
    },
  })
}

export { CONTAINER_ID }

export default main
