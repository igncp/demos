import { select } from "d3"
import hotkeys from "hotkeys-js"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"

import { CirclesChart } from "./population-circles-chart"
import {
  CONTAINER_ID,
  createChartConfig,
  createState,
  fetchData,
} from "./population-circles-chart-data"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/slider")
}

const main = async () => {
  hotkeys("control", () => {})

  const municipalities = await fetchData()

  const state = createState()
  const chartConfig = createChartConfig({ municipalities, state })

  const chart = new CirclesChart(chartConfig)

  select("form").on(
    "change",
    // eslint-disable-next-line id-denylist
    (changeEvent: { target: { value: typeof state["populationType"] } }) => {
      state.populationType = changeEvent.target.value
      chart.update()
    }
  )

  $(".population-slider").slider({
    change: (...[, { values: populationValues }]) => {
      const newValues = (populationValues as [number, number]).map(
        (v) => v / 100
      ) as [number, number]

      state.populationRange = newValues
      chart.update()
    },
    range: true,
    values: [0, 100], // eslint-disable-line id-denylist
  })

  const max = municipalities[0].metrics.total.length - 1

  $(".time-slider").slider({
    change: (...[, { value: timeRangeIndex }]) => {
      state.timeRangeIndex = timeRangeIndex as number
      chart.update()
    },
    max,
    min: 0,
    value: 0, // eslint-disable-line id-denylist
  })
}

export { CONTAINER_ID }

export default main
