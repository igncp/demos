import {
  TimeBandItem,
  fetchData,
  getChartConfig,
} from "./philosophers-timeline-chart-data"
import { Timeline } from "./timeline-bands-brush-chart"
import { CONTAINER_ID } from "./ui-constants"

enum BandName {
  Main = "mainBand",
  Navi = "naviBand",
}

const main = async () => {
  const timelineData = await fetchData()
  const chartConfig = getChartConfig()

  new Timeline<TimeBandItem>(chartConfig)
    .addChartData(timelineData)
    .addBand({ bandName: BandName.Main, sizeFactor: 0.82 })
    .addBand({ bandName: BandName.Navi, sizeFactor: 0.08 })
    .xAxis(BandName.Main)
    .xAxis(BandName.Navi)
    .labels(BandName.Main)
    .labels(BandName.Navi)
    .addBrush({ brushBandName: BandName.Navi, targetBandName: BandName.Main })
    .redraw()
    .createTooltip()
}

export { CONTAINER_ID }

export default main
