import { ChartConfig } from "./bars-chart"
import { CONTAINER_ID } from "./ui-constants"

type BarData = number

const fetchData = async (): Promise<BarData[]> => {
  const rawData = await fetch(`${ROOT_PATH}data/d3js/bars/data.json`)

  return rawData.json()
}

const createChartConfig = ({ bars }: { bars: BarData[] }): ChartConfig => ({
  bars: bars.map((...[metric, metricIndex]) => ({
    id: metricIndex,
    metric,
  })),
  rootElId: CONTAINER_ID,
  withoutInterval: (window.location.search || "").includes("interval=false"),
})

export { createChartConfig, fetchData }
