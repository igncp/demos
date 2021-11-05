import { CirclesChart } from "./circles-chart"
import {
  CONTAINER_ID,
  State,
  VALUES_SLIDER_ID,
  fetchData,
  getChartConfig,
} from "./concentric-circles-config"

const main = async () => {
  const namesMetrics = await fetchData()
  const defaultPercentage = 100
  const state: State = {
    percentage: defaultPercentage,
  }

  const chartConfig = getChartConfig({
    namesMetrics,
    state,
  })

  const chart = CirclesChart.renderChart(chartConfig)

  $(`#${VALUES_SLIDER_ID}`).slider({
    change: (...[, { value: percentageValue }]) => {
      state.percentage = percentageValue as number
      chart.refresh()
    },
    max: 100,
    min: 0,
    value: defaultPercentage, // eslint-disable-line id-denylist
  })
}

export { CONTAINER_ID, VALUES_SLIDER_ID }

export default main
