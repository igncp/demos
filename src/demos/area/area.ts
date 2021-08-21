import { renderChart } from "./area-chart"
import { IncomeItem, createChartConfig, fetchData } from "./area-chart-data"

const main = async () => {
  const dataPoints = await fetchData()
  const chartConfig = createChartConfig(dataPoints)

  const { toggleVoronoi } = renderChart<IncomeItem>(chartConfig)

  ;(document.getElementById("toggle-voronoi") as HTMLElement).addEventListener(
    "click",
    (clickEvent: MouseEvent) => {
      clickEvent.preventDefault()

      toggleVoronoi()
    }
  )
}

export default main
