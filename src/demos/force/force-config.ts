import { ChartConfig } from "./chart/force-chart"
import { SampleLink, SampleNode } from "./force-data"
import { CONTAINER_ID } from "./ui-constants"

type Config = ChartConfig<SampleNode, SampleLink>

const getNodeText: Config["getNodeText"] = (node) => node.name

const getChartConfig = ({
  forceData,
}: {
  forceData: Config["forceData"]
}): Config => ({
  forceData,
  getNodeText,
  height: 600,
  rootElId: CONTAINER_ID,
})

export { getChartConfig }
