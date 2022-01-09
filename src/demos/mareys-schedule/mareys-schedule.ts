import { CrossingLinesChart } from "./crossing-lines-chart"
import { createChartConfig } from "./mareys-schedule-chart-config"
import { RANGE_ID, setupControls } from "./mareys-schedule-controls"
import { MareysSchedules } from "./mareys-schedule-data-model"
import { CONTAINER_ID } from "./ui-constants"

const main = async () => {
  const schedules = await MareysSchedules.fetchAndCreateSchedules()

  const chartConfig = createChartConfig(schedules)

  const chart = new CrossingLinesChart(chartConfig)

  setupControls((timeLimits) => {
    chart.refresh(timeLimits)
  })
}

export { CONTAINER_ID, RANGE_ID }

export default main
