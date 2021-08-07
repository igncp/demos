import { renderChart } from "./area-chart"
import { Point, createChartConfig, fetchData } from "./area-chart-data"

const main = async () => {
  const data = await fetchData()
  const chartConfig = createChartConfig(data)

  const { toggleVoronoi } = renderChart<Point>(chartConfig)

  ;(document.getElementById("toggle-voronoi") as HTMLElement).addEventListener(
    "click",
    (e) => {
      e.preventDefault()

      toggleVoronoi()
    }
  )
}

export default main
