import { ForceChart } from "./chart/force-chart"
import { getChartConfig } from "./force-config"
import { setupControls } from "./force-controls"
import { fetchForceData } from "./force-data"
import { CONTAINER_ID, RADIUS_SELECT_ID } from "./ui-constants"

// @TODO: refactors, responsive, interactions

const main = async () => {
  const forceData = await fetchForceData()
  const chartConfig = getChartConfig({ forceData })

  const chart = new ForceChart(chartConfig)

  setupControls({
    initialRadiusValue: ForceChart.defaultRadius,
    onRadiusChange: (newValue) => {
      chart.setRadius(newValue)
    },
  })
}

export { CONTAINER_ID, RADIUS_SELECT_ID }

export default main
