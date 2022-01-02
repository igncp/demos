import { max } from "d3"

import { BarsChart } from "./bars-chart"
import { createChartConfig, fetchData } from "./bars-chart-config"
import { ADD_BAR_BUTTON_ID, CONTAINER_ID } from "./ui-constants"

const main = async () => {
  const initialBars = await fetchData()

  const chartConfig = createChartConfig({ bars: initialBars })

  const barsChart = new BarsChart(chartConfig)

  const addItemEl = document.getElementById(ADD_BAR_BUTTON_ID) as HTMLElement

  addItemEl.addEventListener("click", () => {
    const bars = barsChart.getBars()
    const newId = max(bars, (bar) => bar.id)! + 1

    barsChart.addBar({
      id: newId,
      metric:
        Math.floor(Math.random() * (max(bars, (bar) => bar.metric) as number)) +
        1,
    })
    barsChart.refresh()

    if (bars.length >= 20) {
      addItemEl.setAttribute("disabled", "disabled")
    }
  })
}

export { ADD_BAR_BUTTON_ID, CONTAINER_ID }

export default main
