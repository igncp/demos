import { Timeline } from "./philosophers-timeline-chart"
import {
  TimeBandItem,
  fetchData,
  getChartConfig,
} from "./philosophers-timeline-chart-data"

const main = async () => {
  const timelineData = await fetchData()
  const chartConfig = getChartConfig()

  new Timeline<TimeBandItem>(chartConfig)
    .addChartData(timelineData)
    .addBand({ bandName: "mainBand", sizeFactor: 0.82 })
    .addBand({ bandName: "naviBand", sizeFactor: 0.08 })
    .xAxis("mainBand")
    .xAxis("naviBand")
    .labels("mainBand")
    .labels("naviBand")
    .addBrush({ bandName: "naviBand", targetNames: ["mainBand"] })
    .redraw()
    .createTooltip()
}

export default main
