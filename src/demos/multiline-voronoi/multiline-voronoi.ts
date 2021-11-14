import { select } from "d3"

import { MultilineVoronoiChart } from "./multiline-voronoi-chart"
import {
  CONTAINER_ID,
  SHOW_VORONOI_ID,
  fetchData,
  getChartConfig,
} from "./multiline-voronoi-chart-config"
import * as styles from "./multiline-voronoi.module.css"

const main = async () => {
  const { cities, months } = await fetchData()
  const chartConfig = getChartConfig({ cities, months })

  const chart = new MultilineVoronoiChart(chartConfig)

  const form = document.getElementById(styles.formVoronoi) as HTMLElement
  const chartEl = document.getElementById(CONTAINER_ID) as HTMLElement

  chartEl.appendChild(form)

  select(`#${SHOW_VORONOI_ID}`)
    .property("disabled", false)
    .on("change", (mouseEvent: MouseEvent) => {
      chart.setVoronoi((mouseEvent.target as HTMLInputElement).checked || false)
    })
}

export { CONTAINER_ID, SHOW_VORONOI_ID }

export default main
