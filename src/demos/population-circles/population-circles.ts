import { select } from "d3"
import hotkeys from "hotkeys-js"

import { renderChart } from "./population-circles-chart"
import {
  Municipality,
  createChartConfig,
  createState,
  fetchData,
} from "./population-circles-chart-data"

const main = async () => {
  hotkeys("control", () => {})

  const municipalities = await fetchData()

  const state = createState()
  const chartConfig = createChartConfig(municipalities, state)

  const { updateChart } = renderChart<Municipality>(chartConfig)

  select("form").on("change", (e) => {
    state.populationType = e.target.value
    updateChart()
  })

  $(".population-slider").slider({
    change: (_event, { values }) => {
      const newValues = (values as [number, number]).map((v) => v / 100) as [
        number,
        number
      ]

      state.populationRange = newValues
      updateChart()
    },
    range: true,
    values: [0, 100],
  })

  const max = municipalities[0].values.total.length - 1

  $(".time-slider").slider({
    change: (_event, { value }) => {
      state.timeRangeIndex = value as number
      updateChart()
    },
    max,
    min: 0,
    value: 0,
  })
}

export default main
