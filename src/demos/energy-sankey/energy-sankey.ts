import hotkeys from "hotkeys-js"
import qs from "query-string"

import { createChartConfig, fetchData } from "./energy-sankey-chart-data"
import { SankeyChart } from "./sankey-chart"
import { CONTAINER_ID } from "./ui-constants"

const main = async () => {
  hotkeys("control", () => {})

  const energySankeyData = await fetchData()

  const chartConfig = createChartConfig({
    energySankeyData,
    onNodeClick: (node) => {
      if (!hotkeys.isPressed("control")) {
        return false
      }

      window.open(
        `https://www.google.com/search?${qs.stringify({
          ie: "UTF-8",
          q: `Energy ${node.name}`,
        })}`
      )

      return true
    },
  })

  new SankeyChart(chartConfig)
}

export { CONTAINER_ID }

export default main
