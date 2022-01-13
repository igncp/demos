import { ForceChart } from "./force-chart"
import { getChartConfig } from "./force-config"
import { fetchForceData } from "./force-data"
import { CONTAINER_ID } from "./ui-constants"

// @TODO: refactors, responsive, interactions

const main = async () => {
  const forceData = await fetchForceData()
  const chartConfig = getChartConfig({ forceData })

  new ForceChart(chartConfig)
}

export { CONTAINER_ID }

export default main
