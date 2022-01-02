import { renderChart } from "./crossing-lines-chart"
import { createChartConfig } from "./mareys-schedule-chart-config"
import { RANGE_ID, setupControls } from "./mareys-schedule-controls"
import { MareysSchedules } from "./mareys-schedule-data-model"
import { CONTAINER_ID } from "./ui-constants"

// @TODO: Add interaction on click

const main = async () => {
  const schedules = await MareysSchedules.fetchAndCreateSchedules()

  const chartConfig = createChartConfig(schedules)

  const { refresh: updateScheduleLimits } = renderChart(chartConfig)

  setupControls(updateScheduleLimits)
}

export { CONTAINER_ID, RANGE_ID }

export default main
