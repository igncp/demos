import { select } from "d3"
import hotkeys from "hotkeys-js"

import { renderChart } from "./population-circles-chart"
import {
  CONTAINER_ID,
  Municipality,
  createChartConfig,
  createState,
  fetchData,
} from "./population-circles-chart-data"

const main = async () => {
  hotkeys("control", () => {})

  const municipalities = await fetchData()

  const state = createState()
  const chartConfig = createChartConfig({ municipalities, state })

  const { updateChart } = renderChart<Municipality>(chartConfig)

  select("form").on(
    "change",
    // eslint-disable-next-line id-denylist
    (changeEvent: { target: { value: typeof state["populationType"] } }) => {
      state.populationType = changeEvent.target.value
      updateChart()
    }
  )

  $(".population-slider").slider({
    change: (...[, { values: populationValues }]) => {
      const newValues = (populationValues as [number, number]).map(
        (v) => v / 100
      ) as [number, number]

      state.populationRange = newValues
      updateChart()
    },
    range: true,
    values: [0, 100], // eslint-disable-line id-denylist
  })

  const max = municipalities[0].metrics.total.length - 1

  $(".time-slider").slider({
    change: (...[, { value: timeRangeIndex }]) => {
      state.timeRangeIndex = timeRangeIndex as number
      updateChart()
    },
    max,
    min: 0,
    value: 0, // eslint-disable-line id-denylist
  })
}

export { CONTAINER_ID }

export default main
