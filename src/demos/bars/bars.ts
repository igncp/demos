import { max } from "d3"

import { BarsChart } from "./bars-chart"
import { CONTAINER_ID, createChartConfig, fetchData } from "./bars-chart-config"
import * as styles from "./bars.module.css"

const main = async () => {
  const bars = await fetchData()

  const chartConfig = createChartConfig({ bars })

  const barsChart = new BarsChart(chartConfig)

  barsChart.render()

  const addItemEl = document.getElementById(styles.addItemButton) as HTMLElement

  addItemEl.addEventListener("click", () => {
    bars.push(Math.floor(Math.random() * (max(bars) as number)) + 1)
    barsChart.refresh()

    if (bars.length >= 20) {
      addItemEl.setAttribute("disabled", "disabled")
    }
  })
}

export { CONTAINER_ID }

export default main
