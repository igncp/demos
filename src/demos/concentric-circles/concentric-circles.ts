import { CirclesChart } from "./circles-chart"
import {
  CONTAINER_ID,
  ZOOM_SLIDER_ID,
  fetchData,
  getChartConfig,
} from "./concentric-circles-config"

const main = async () => {
  const namesMetrics = await fetchData()
  const { defaultZoom } = CirclesChart

  const chartConfig = getChartConfig({
    namesMetrics,
  })

  const chart = CirclesChart.renderChart(chartConfig)

  $(`#${ZOOM_SLIDER_ID}`).slider({
    change: (...[, { value: zoomValue }]) => {
      chart.setZoom(zoomValue as number)
    },
    max: 100,
    min: defaultZoom,
    value: defaultZoom, // eslint-disable-line id-denylist
  })
}

export { CONTAINER_ID, ZOOM_SLIDER_ID }

export default main
