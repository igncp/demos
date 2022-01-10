import { json } from "d3"

import { ChartConfig } from "./force-chart"
import { CONTAINER_ID } from "./ui-constants"

type CustomNode = {
  name: string
}

type Config = ChartConfig<CustomNode>

const fetchForceData = async (): Promise<Config["forceData"]> => {
  const [nodes, links] = await Promise.all([
    json(`${ROOT_PATH}data/d3js/force/nodes.json`),
    json(`${ROOT_PATH}data/d3js/force/links.json`),
  ])

  return {
    links,
    nodes,
  } as Config["forceData"]
}

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

export { fetchForceData, getChartConfig }
