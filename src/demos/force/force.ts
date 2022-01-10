import { ForceChart } from "./force-chart"
import { fetchForceData, getChartConfig } from "./force-config"
import { CONTAINER_ID } from "./ui-constants"

// @TODO: refactors, responsive, interactions

const main = async () => {
  const forceData = await fetchForceData()
  const chartConfig = getChartConfig({ forceData })

  new ForceChart(chartConfig)
}

export { CONTAINER_ID }

export default main
