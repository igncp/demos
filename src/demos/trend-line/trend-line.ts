import { selectAll } from "d3"

import { TrendLineChart } from "./trend-line-chart"
import { fetchData, getChartConfig } from "./trend-line-chart-config"
import { CONTAINER_ID } from "./ui-constants"

const main = async () => {
  const lineData = await fetchData()

  const getIsZoomed = () =>
    (document.querySelector('input[value="zoom"]') as HTMLInputElement).checked

  const chartConfig = getChartConfig({
    initialZoomed: getIsZoomed(),
    lineData,
  })

  const chart = new TrendLineChart(chartConfig)

  selectAll('input[name="mode"]').on("change", () => {
    const isZoomed = getIsZoomed()

    chart.renderContent(isZoomed)
  })
}

export { CONTAINER_ID }

export default main
